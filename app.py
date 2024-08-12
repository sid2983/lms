# from flask import Flask
# from flask_security import SQLAlchemyUserDatastore, Security
# from lms.models import db ,Role, User
# from config import DevelopmentConfig
# from lms.resources import api


# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(DevelopmentConfig)
#     db.init_app(app)
#     api.init_app(app)
#     datastore = SQLAlchemyUserDatastore(db, User, Role)
#     app.security = Security(app, datastore)
#     with app.app_context():
#         import lms.resources
        
#     return app, datastore

from lms import create_app
from lms.worker import celery_init_app
from celery.schedules import crontab
from lms.tasks import daily_reminder


app, datastore = create_app()

celery_app = celery_init_app(app)


@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    print("Celery email configured")
    # sender.add_periodic_task(30.0, test.s('hello'), name='add every 30')
    sender.add_periodic_task(
        crontab(hour=14, minute=4, day_of_week=1),
        daily_reminder.s("sid24000576@gmail.com","test-celery-check","<html><body><h1>"+" Hello Guys !!"+"</h1></body></html>"),
    )



if __name__ == '__main__':
    app.run(debug=True)
