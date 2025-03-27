from flask import Blueprint, render_template, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector

auth = Blueprint('auth', __name__)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root", 
            password="", 
            database="auth_system"  
        )
    except mysql.connector.Error as err:
        raise Exception(f"Database connection failed: {err}")

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return jsonify({"message": "Email and password are required"}), 400

            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            cursor.close()
            db.close()

            if not user:
                return jsonify({"message": "User not found"}), 404

            if not check_password_hash(user['password'], password):
                return jsonify({"message": "Invalid credentials"}), 401

            return jsonify({"message": "Login successful", "user": {"fullname": user['fullname'], "email": user['email']}}), 200

        except mysql.connector.Error as err:
            return jsonify({"error": f"Database error: {err}"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return render_template("login.html")

@auth.route('/logout')
def logout():
    return render_template("logout.html")

@auth.route('/sign-up', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        try:
            data = request.get_json()
            fullname = data.get('fullname')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            if not fullname or not email or not password or not confirm_password:
                return jsonify({"error": "All fields are required"}), 400
            if password != confirm_password:
                return jsonify({"error": "Passwords do not match"}), 400

            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()
            if existing_user:
                cursor.close()
                db.close()
                return jsonify({"error": "Email already exists"}), 400

            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

            cursor.execute(
                "INSERT INTO users (fullname, email, password) VALUES (%s, %s, %s)",
                (fullname, email, hashed_password)
            )
            db.commit()
            cursor.close()
            db.close()

            print("✅ Data inserted successfully") 
            return jsonify({"message": "Sign-up successful"}), 201

        except mysql.connector.Error as err:
            return jsonify({"error": f"Database error: {err}"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return render_template("signup.html")

@auth.route('/')
def home():
    return render_template("home.html")
