class Config(object):
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///lms_database.db'
    SECRET_KEY = "Sid2983@#"
    SECURITY_PASSWORD_SALT = "thisissaltt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SMTP_SERVER = "localhost"
    SMTP_PORT = 1025
    SENDER_EMAIL = "22f1000339@ds.study.iitm.ac.in"
    SENDER_PASSWORD = ""
