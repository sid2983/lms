import os
import secrets
from datetime import datetime, timedelta

from PIL import Image
from flask_restful import Api, Resource,reqparse,marshal_with, fields
from flask import current_app as app,jsonify,request
from lms.models import db, Role, User, Section, Book, IssuedBook, RequestedBook
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
        
        try:
        # Assuming you have a relationship set up in your Section model
            related_books = Book.query.filter_by(section_id=section_id).all()

            # Delete related books
            for book in related_books:
                db.session.delete(book)
                print("Books deleted")

            db.session.delete(section)
            db.session.commit()
            return {'message': 'Section deleted'}, 200
        
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting section and related books: {e}")
            return {'message': 'An error occurred while deleting the section'}, 500
    







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









################### USERS Dashboard  #########################



@app.route('/api/books/available', methods=['GET'])
@auth_required('token')
def get_available_books():
    # Assuming 'Book' and 'IssuedBook' models are defined
    available_books = db.session.query(Book).outerjoin(IssuedBook).filter(IssuedBook.id.is_(None)).all()
    books = [{'id': book.id, 'name': book.name, 'author': book.author, 'img_file':book.img_file} for book in available_books]
    return jsonify(books), 200


@app.route('/api/books/<int:book_id>/request', methods=['POST'])
def request_book(book_id):
    # Check if the book exists
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404
    
    requests = RequestedBook.query.filter_by(user_id=current_user.id).all()
    if len(requests) >= 5:
        return jsonify({'error': 'You have reached the maximum limit of book requests'}), 410
    
    existing_request = RequestedBook.query.filter_by(
        user_id=current_user.id,
        book_id=book_id,
        status='pending'
    ).first()

    if existing_request:
        return jsonify({'error': 'You have already requested this book.'}), 400

    # Create a RequestedBook record with the current_user
    requested_book = RequestedBook(user_id=current_user.id, book_id=book_id, status='pending')
    db.session.add(requested_book)
    db.session.commit()

    return jsonify({'message': 'Book requested successfully'}), 201





@app.route('/api/user/my-books', methods=['GET'])
def get_user_books():
    user_id = current_user.id
    
    # Fetch issued books
    issued_books = IssuedBook.query.filter_by(user_id=user_id,status="active").all()
    issued_books_list = []
    for issued_book in issued_books:
        book = Book.query.get(issued_book.book_id)
        issued_books_list.append({
            'id': book.id,
            'name': book.name,
            'author': book.author,
            'img_file':book.img_file,
            'issue_date': issued_book.issued_date,
            'returnable': issued_book.expected_return_date   # Assuming returnable if no return_date
        })
    
    # Fetch pending books
    pending_books = RequestedBook.query.filter_by(user_id=user_id, status='pending').all()
    pending_books_list = []
    for pending_book in pending_books:
        book = Book.query.get(pending_book.book_id)
        pending_books_list.append({
            'id': book.id,
            'name': book.name,
            'author': book.author,
            'img_file':book.img_file,
            'request_date': pending_book.request_date
        })

    # Fetch read books (Assuming read books have a return_date set)
    read_books = IssuedBook.query.filter_by(user_id=user_id).filter(IssuedBook.actual_return_date.isnot(None)).all()
    read_books_list = []
    for read_book in read_books:
        book = Book.query.get(read_book.book_id)
        read_books_list.append({
            'id': book.id,
            'name': book.name,
            'author': book.author,
            'img_file':book.img_file,
            'issue_date': read_book.issued_date,
            'till_read_date': read_book.actual_return_date  # Assuming return_date as read_date
        })

    return jsonify({
        'issuedBooks': issued_books_list,
        'pendingBooks': pending_books_list,
        'readBooks': read_books_list
    })






request_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'book_id': fields.Integer,
    'status': fields.String,
    'request_date': fields.DateTime(dt_format='iso8601'),
    'book_name': fields.String,
    'book_author': fields.String,
    'img_file': fields.String,
    'username': fields.String,
}

issued_book_fields = {
    'id': fields.Integer,
    'book_id': fields.Integer,
    'user_id': fields.Integer,
    'issue_date': fields.DateTime(dt_format='iso8601'),
    'expected_return_date': fields.DateTime(dt_format='iso8601'),
    'actual_return_date': fields.DateTime(dt_format='iso8601'),
    'status': fields.String,
    'book_name': fields.String,
    'book_author': fields.String,
    'img_file': fields.String,
    'username': fields.String,

}



@api.resource('/librarian/requests')
class RequestManagement(Resource):
    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(request_fields)
    def get(self):
        # Get all pending requests
        all_requests = RequestedBook.query.filter_by(status='pending').all()
        
        requests = [{
            'id': request.id,
            'user_id': request.user_id,
            'book_id': request.book_id, 
            'status': request.status, 
            'request_date': request.request_date ,
            'book_name':request.book.name,
            'book_author':request.book.author,
            'img_file':request.book.img_file,
            'username':request.user.username,
            } for request in all_requests]  
        print(requests[0])
        return requests, 200


    # 
    @auth_required('token')
    @roles_required('librarian')
    def post(self):
        data = request.get_json()
        request_id = data.get('request_id')
        action = data.get('action')  # 'grant' or 'cancel'

        request_entry = RequestedBook.query.get(request_id)
        if not request_entry:
            return {'message': 'Request not found'}, 404

        if action == 'grant':
            # Grant the request and issue the book
            book = Book.query.get(request_entry.book_id)
            if not book:
                return {'message': 'Book not found'}, 404
            
            issued_book = IssuedBook(
                book_id=book.id,
                user_id=request_entry.user_id,
                expected_return_date=datetime.now() + timedelta(days=7),
                status='active'
            )
            db.session.add(issued_book)
            request_entry.status = 'approved'
            db.session.commit()
            return {'message': 'Request granted and book issued'}, 200

        elif action == 'cancel':
            # Cancel the request
            request_entry.status = 'rejected'
            db.session.commit()
            return {'message': 'Request cancelled'}, 200

        return {'message': 'Invalid action'}, 400
    



@api.resource('/librarian/issued-books')
class IssuedBooksManagement(Resource):
    @auth_required('token')
    @roles_required('librarian')
    @marshal_with(issued_book_fields)
    def get(self):
        # Get all issued books
        issued_books = IssuedBook.query.all()
        issued_books = [{
            'id': issued_book.id,
            'book_id': issued_book.book_id,
            'user_id': issued_book.user_id,
            'issue_date': issued_book.issued_date,
            'expected_return_date': issued_book.expected_return_date,
            'actual_return_date': issued_book.actual_return_date,
            'status': issued_book.status,
            'book_name': issued_book.book.name,
            'book_author': issued_book.book.author,
            'img_file': issued_book.book.img_file,
            'username': issued_book.user.username,
        } for issued_book in issued_books]
        return issued_books, 200


    # Revoke access manually by librarian

    @auth_required('token')
    @roles_required('librarian')
    def post(self):
        data = request.get_json()
        issued_book_id = data.get('issued_book_id')
        action = data.get('action')  # 'revoke'

        issued_book = IssuedBook.query.get(issued_book_id)
        if not issued_book:
            return {'message': 'Issued book not found'}, 404

        if action == 'revoke':
            issued_book.status = 'revoked'
            issued_book.actual_return_date = datetime.now()
            db.session.commit()
            return {'message': 'Access revoked and book returned'}, 200

        return {'message': 'Invalid action'}, 400
    



@api.resource('/books/<int:book_id>/return')
class ReturnBookResource(Resource):
    @auth_required('token')
    @roles_required('user')
    def post(self, book_id):
        user_id = current_user.id
        # Fetch the issued book record
        issued_book = IssuedBook.query.filter_by(book_id=book_id, user_id=user_id, status='active').first()
        
        if not issued_book:
            return {'message': 'Book is not issued to this user or already returned'}, 404
        
        # Update the book status and return date
        issued_book.status = 'returned'
        issued_book.actual_return_date = datetime.now()
        db.session.commit()
        
        return {'message': 'Book returned successfully'}, 200