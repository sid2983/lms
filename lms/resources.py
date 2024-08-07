import os
import secrets
from PIL import Image
from flask_restful import Api, Resource,reqparse,marshal_with, fields
from flask import current_app as app,jsonify,request
from lms.models import db, Role, User, Section, Book
from flask import render_template
from flask_security import current_user
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
                profile_pic_url = user.profile_pic
                
                return {
                    'token': user.get_auth_token(),
                    'email': user.email,
                    'role': role,
                    'profile_pic': profile_pic_url

                }, 200
            return {'message': 'Invalid credentials'}, 400
        return {'message': 'User not found'}, 404




@api.resource('/profile')
class UserProfile(Resource):
    @auth_required('token')
    @roles_required('user')
    def get(self):
        user = current_user
        print(user)
        # print(user.profile_pic)
        return {
            'username': user.username,
            'email': user.email,
            'role': user.roles[0].name,
            'profile_pic': user.profile_pic,

            # Add more fields as necessary
        }, 200
    


def save_picture(form_picture):
    if form_picture.filename == '':
        return None
    
    # Generate a random hex string to ensure unique filenames
    random_hex = secrets.token_hex(8)
    _, file_extension = os.path.splitext(form_picture.filename)
    picture_filename = random_hex + file_extension
    profile_pics_path = os.path.join(app.root_path, 'static', 'profile_pics')
    # Create the directory if it does not exist
    if not os.path.exists(profile_pics_path):
        os.makedirs(profile_pics_path)
    
    picture_path = os.path.join(profile_pics_path, picture_filename)
    
    # Resize image if needed (optional)
    output_size = (125, 125)
    try:
        with Image.open(form_picture) as img:
            img.thumbnail(output_size)
            img.save(picture_path)
    except Exception as e:
        print(f"Error saving image: {e}")
        return None

    return picture_filename



@api.resource('/profile/edit')
class EditProfile(Resource):
    @auth_required('token')
    @roles_required('user')
    def put(self):
        user = current_user
        data = request.form
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        print(data,data.get('username'))
        
        profile_pic = request.files.get('profile_pic')
        if profile_pic:
            picture_filename = save_picture(profile_pic)
            if picture_filename:
                user.profile_pic = picture_filename
        
        db.session.commit()
        return {'message': 'Profile updated successfully'}, 200









########################### Librarian ############################



######## Section Management



section_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description':fields.String,
}





@api.resource('/sections', '/sections/<int:section_id>')
class SectionManagement(Resource):
    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(section_fields)
    def get(self, section_id=None):
        if section_id:
            section = Section.query.get(section_id)
            if not section:
                return {'message': 'Section not found'}, 404
            return section
        sections = Section.query.all()
        return sections, 200

    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(section_fields)
    def post(self):
        name = request.form.get('name')
        description = request.form.get('description')
        if not name:
            return {'message': 'Section name is required'}, 400
        
        new_section = Section(name=name,description=description)
        db.session.add(new_section)
        db.session.commit()
        return new_section, 201

    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(section_fields)
    def put(self, section_id):
        section = Section.query.get(section_id)
        if not section:
            return {'message': 'Section not found'}, 404
        
        name = request.form.get('name')
        description = request.form.get('description')
        if name:
            section.name = name
            section.description = description
        
        db.session.commit()
        return section, 200

    @auth_required('token')
    @roles_required('librarian')
    def delete(self, section_id):
        section = Section.query.get(section_id)
        if not section:
            return {'message': 'Section not found'}, 404
        
        db.session.delete(section)
        db.session.commit()
        return {'message': 'Section deleted'}, 200
    







####### Ebook Management



book_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'img_file': fields.String,
    'content': fields.String,
    'author': fields.String,
    'date_issued': fields.DateTime(dt_format='iso8601'),
    'section_id': fields.Integer,
    'section': fields.Nested({
        'id': fields.Integer,
        'name': fields.String
    })
}





def save_ebook_picture(form_picture):
    if form_picture.filename == '':
        return None
    
    # Generate a random hex string to ensure unique filenames
    random_hex = secrets.token_hex(8)
    _, file_extension = os.path.splitext(form_picture.filename)
    picture_filename = random_hex + file_extension
    ebook_pics_path = os.path.join(app.root_path, 'static', 'ebook_pics')
    # Create the directory if it does not exist
    if not os.path.exists(ebook_pics_path):
        os.makedirs(ebook_pics_path)
    
    picture_path = os.path.join(ebook_pics_path, picture_filename)
    
    # Resize image if needed (optional)
    output_size = (125, 125)
    try:
        with Image.open(form_picture) as img:
            img.thumbnail(output_size)
            img.save(picture_path)
    except Exception as e:
        print(f"Error saving image: {e}")
        return None

    return picture_filename




@api.resource('/ebooks', '/ebooks/<int:book_id>')
class EbookManagement(Resource):
    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(book_fields)
    def get(self, book_id=None):
        if book_id:
            book = Book.query.get(book_id)
            if not book:
                return {'message': 'Book not found'}, 404
            return book
        books = Book.query.all()
        return books, 200

    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(book_fields)
    def post(self):
        title = request.form.get('title')
        author = request.form.get('author')
        section_id = request.form.get('section_id')
        img_file = request.files.get('img_file')  # Optional
        content = request.form.get('content', '')  # Optional
        # date_issued = request.form.get('date_issued')
        # return_date = request.form.get('return_date')

        if not title or not author or not section_id:
            return {'message': 'Title, author, and section are required'}, 400
        print(img_file)
        picture_filename = save_ebook_picture(img_file)
        

        new_book = Book(
            name=title,
            author=author,
            section_id=section_id,
            img_file=picture_filename,
            content=content,
            # date_issued=date_issued,
            # return_date=return_date
        )
        db.session.add(new_book)
        db.session.commit()
        return new_book, 201

    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(book_fields)
    def put(self, book_id):
        book = Book.query.get(book_id)
        if not book:
            return {'message': 'Book not found'}, 404

        title = request.form.get('title')
        author = request.form.get('author')
        section_id = request.form.get('section_id')
        img_file = request.files.get('img_file')
        content = request.form.get('content')
        # date_issued = request.form.get('date_issued')
        # return_date = request.form.get('return_date')

        if title:
            book.name = title
        if author:
            book.author = author
        if section_id:
            book.section_id = section_id
        if img_file:
            picture_filename = save_ebook_picture(img_file)
            if picture_filename:
                book.img_file = picture_filename
        if content:
            book.content = content
        # if date_issued:
        #     book.date_issued = date_issued
        # if return_date:
        #     book.return_date = return_date

        db.session.commit()
        return book, 200

    @auth_required('token')
    @roles_required('librarian')
    def delete(self, book_id):
        book = Book.query.get(book_id)
        if not book:
            return {'message': 'Book not found'}, 404

        db.session.delete(book)
        db.session.commit()
        return {'message': 'Book deleted'}, 200
