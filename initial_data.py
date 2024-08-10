from app import app,datastore
from lms.models import db, Role, User
# from flask_security.utils import generate_password_hash
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    print("Database created successfully")
    print("Tables created successfully")
    datastore.find_or_create_role(name='librarian', description='Librarian Role')
    datastore.find_or_create_role(name='user', description='General User Role')
    db.session.commit()
    if not datastore.find_user(email="sid24000576@gmail.com"):
        datastore.create_user(username="libx576",email="sid24000576@gmail.com",password=generate_password_hash("Sid@123"),roles=['librarian'])
        db.session.commit()
        print("Librarian user created successfully")
        
    else:
        print("Librarian user already exists")

    if not datastore.find_user(email="sidx576@gmail.com"):
        datastore.create_user(username="sidx576",email="sidx576@gmail.com",password=generate_password_hash("Sid@123"),roles=['user'])
        db.session.commit()
        print("General User created successfully")
    else:    
        print("General user already exists")

    
    print("Initial data added successfully")
    print("Database initialization completed")










