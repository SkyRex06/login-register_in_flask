# filepath: website/auth.py
from flask import Blueprint

auth = Blueprint('auth', __name__)  


@auth.route('/login')
def login():
    return "Login Page"

@auth.route('/logout')
def logout():
    return "<p>Logout Page</p>"

@auth.route('/sign-up')
def signup():
    return "<p>sign-up Page</p>"