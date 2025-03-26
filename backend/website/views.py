# filepath: website/views.py
from flask import Blueprint

views = Blueprint('views', __name__)  # Define the Blueprint

@views.route('/')
def home():
    return 'Welcome to the home page!'
