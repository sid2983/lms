
from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SMTP_SERVER = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = "22f1000339@ds.study.iitm.ac.in"
SENDER_PASSWORD = ""


def send_message(to, subject, body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(body, "html"))
    client = SMTP(host = SMTP_SERVER, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()

# send_message("sid24000576@gmail.com","test",'<html><body><h1>Test</h1></body></html>')