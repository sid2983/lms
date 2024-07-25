from flask_security import UserMixin, RoleMixin
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()


roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)

class User(db.Model, UserMixin):
    __tablename__ = 'user'

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    profile_pic = db.Column(db.String(128),nullable=False, default='avatar.png')

    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if not self.fs_uniquifier:
            self.fs_uniquifier = str(uuid.uuid4())

    def __repr__(self):
        return f"User('{self.username}')"
    
    def get_role_names(self):
        return [role.name for role in self.roles]

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String(255))

    def __repr__(self):
        return f"Role('{self.name}')"

class Section(db.Model):
    __tablename__ = 'section'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    date_created = db.Column(db.DateTime(), default=datetime.now())
    description = db.Column(db.Text())

    def __repr__(self):
        return f"Section('{self.name}')"

class Book(db.Model):
    __tablename__ = 'book'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    img_file = db.Column(db.String(20), nullable=False, default='default1.jpeg')
    content = db.Column(db.Text())
    author = db.Column(db.String(255))
    date_issued = db.Column(db.DateTime())
    return_date = db.Column(db.DateTime())
    section_id = db.Column(db.Integer(), db.ForeignKey('section.id'))
    section = db.relationship('Section', backref=db.backref('books', lazy='dynamic'))

    issued_books = db.relationship('IssuedBook', backref='book', lazy='dynamic')

    def __repr__(self):
        return f"Book('{self.name}')"

class IssuedBook(db.Model):
    __tablename__ = 'issued_book'

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    book_id = db.Column(db.Integer(), db.ForeignKey('book.id'))
    issue_date = db.Column(db.DateTime())
    return_date = db.Column(db.DateTime())

class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    book_id = db.Column(db.Integer(), db.ForeignKey('book.id'))
    rating = db.Column(db.Integer())
    comment = db.Column(db.Text())

    def __repr__(self):
        return f"Feedback('{self.rating}')"
