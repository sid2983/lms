from celery import shared_task
from lms.models import Book
import flask_excel as excel     


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


     

