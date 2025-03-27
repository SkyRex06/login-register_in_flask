from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/sign-up', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Received data:", data) 

        if not data:
            return jsonify({"error": "No data received"}), 400

        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if not fullname or not email or not password or not confirm_password:
            return jsonify({"error": "All fields are required"}), 400

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        return jsonify({"message": "User registered successfully"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

