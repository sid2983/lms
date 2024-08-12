from celery import shared_task
from lms.models import Book,User
import flask_excel as excel    
from .mail_service import send_message 
from datetime import datetime, timedelta



@shared_task(ignore_result=False)
def create_resource_csv():
    
    data = Book.query.with_entities(Book.id, Book.name, Book.author).all()
    data_list = [['ID', 'Name', 'Author']]  # Column headers
    data_list.extend([[row.id, row.name, row.author] for row in data])
    csv_output = excel.make_response_from_array(data_list, "csv")

    csv_content = csv_output.get_data(as_text=True)
    filename= "test.csv"

    with open(filename,'w', newline='') as f:
        f.write(csv_content)

    return filename



@shared_task(ignore_result=True)
def daily_reminder():

    now = datetime.now()
    day_start = now - timedelta(days=1)
    inactive_users = User.query.filter(User.last_login < day_start).all()
    print(inactive_users)

    for user in inactive_users:
        subject = "Reminder: LMS APP"
        message = f"""
        <html>
        <body>
        <h1>Hello {user.username}!</h1>
        <p>We've noticed that you haven't visited our app in a while. We miss you and hope to see you back soon!</p>
        <p><a href="http://your-app-url">Visit Now</a></p>
        </body>
        </html>
        """
        send_message(user.email, subject, message)

    return "Daily reminders sent to all inactive users"


