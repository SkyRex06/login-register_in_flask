# filepath: website/auth.py
from flask import Blueprint

auth = Blueprint('auth', __name__)  # Define the Blueprint

@auth.route('/hello')  # Added leading '/'
def home():
    return 'Test'

@auth.route('/login')
def login():
    return 'Login Page'