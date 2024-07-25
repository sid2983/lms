# lms/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore
from config import DevelopmentConfig
from .models import User, Role, db

# db = SQLAlchemy()
security = Security()

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    app.static_folder = 'static'
    db.init_app(app)
    
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    security.init_app(app, datastore)

    with app.app_context():
        from .resources import api
        api.init_app(app)
        
        # Ensure the models are created
        db.create_all()

    return app, datastore
