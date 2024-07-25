from flask_restful import Api, Resource,reqparse,marshal_with, fields
from flask import current_app as app,jsonify,request
from lms.models import db, Role, User
from flask import render_template

from flask_security import auth_required, roles_required
from flask_security.utils import hash_password
from werkzeug.security import generate_password_hash, check_password_hash
api = Api(prefix='/api')

datastore = app.extensions['security'].datastore


@app.get('/')
def home():
        return render_template('index.html')
    


@api.resource('/protected')
class Protected(Resource):
    @auth_required("token")
    @roles_required("librarian")
    def get(self):
        return {'hello': 'protected'}
    



### User Registration 

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
    'roles': fields.List(fields.String(attribute='get_role_names'))
}

@api.resource('/register')
class UserRegistration(Resource):
    @marshal_with(user_fields)  
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True, help='Username cannot be blank')
        parser.add_argument('email', type=str, required=True, help='Email cannot be blank')
        parser.add_argument('password', type=str, required=True, help='Password cannot be blank')
        args = parser.parse_args()
        print(args)
        if datastore.find_user(email=args['email']):
            print("User with this email already exists")
            return {'message': 'User with this email already exists'}, 400
        print("new user")
        user_role = datastore.find_or_create_role(name='user', description='General User Role')
        print(user_role)
        user = datastore.create_user(
            username=args['username'],
            email=args['email'],
            password=generate_password_hash(args['password']),
            roles=[user_role],
            active=True  
        )
        
        db.session.commit()

        return user, 201


#login only for user
@api.resource('/user_login')
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = datastore.find_user(email=email)
        #notify if user is not from user role and check for role
        if user:
            if check_password_hash(user.password, password):
                # Get user's role
                role = user.roles[0].name if user.roles else None

                if not role:
                    return {'message': 'User has no role assigned'}, 400

                return {
                    'token': user.get_auth_token(),
                    'email': user.email,
                    'role': role
                }, 200
            return {'message': 'Invalid credentials'}, 400
        return {'message': 'User not found'}, 404



