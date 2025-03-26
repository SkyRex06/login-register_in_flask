from flask import Flask
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')

    from .views import views  # Import the Blueprint object
    from .auth import auth  # Import the auth Blueprint

    app.register_blueprint(views, url_prefix='/')  # Register the views Blueprint
    app.register_blueprint(auth, url_prefix='/auth')  # Register the auth Blueprint

    return app
