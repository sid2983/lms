export default {
    template: `
    <div class="container">
      <div class="row">
        <!-- Issued Books (Horizontal Cards) -->
        <div class="col-md-12">
          <h4>Issued Books</h4>
          <div class="row">
            <div v-for="book in issuedBooks" :key="book.id" class="col-md-3 mb-4">
              <div class="card h-100 w-100 d-flex flex-row border-0 shadow">
                <img :src="getBookImageUrl(book)" class="card-img-left mx-2 my-auto rounded-2" style="width:60px;height:90px;" alt="Book Cover">
                <div class="card-body d-flex flex-column">
                  <strong class="card-title">{{ book.name }}</strong>
                  <span class="card-text">{{ book.author }}</span>
                  <span class="card-text">Issued Date: {{ formatDate(book.issue_date) }}</span>
                  <div class="p-2">
                  <button v-if="book.returnable" @click="returnBook(book.id)" class="btn btn-outline-danger mt-auto">Return Book</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Pending Books (Horizontal Cards) -->
        <div class="col-md-12">
          <h4>Pending Books</h4>
          <div class="row">
            <div v-for="book in pendingBooks" :key="book.id" class="col-md-12 mb-4">
              <div class="card h-100 w-100 d-flex flex-row border-0 shadow">
                <img :src="getBookImageUrl(book)" class="card-img-left mx-2 my-auto rounded-2" style="width:60px;height:90px;" alt="Book Cover">
                <div class="card-body d-flex flex-column">
                  <strong class="card-title">{{ book.name }}</strong>
                  <span class="card-text">{{ book.author }}</span>
                  <span class="card-text">Requested Date: {{ formatDate(book.request_date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Successfully Read Books (Horizontal Cards) -->
        <div class="col-md-12">
          <h4>Successfully Read Books</h4>
          <div class="row">
            <div v-for="book in readBooks" :key="book.id" class="col-md-12 mb-4">
              <div class="card h-100 w-100 d-flex flex-row border-0 shadow">
                <img :src="getBookImageUrl(book)" class="card-img-left mx-2 my-auto rounded-2" style="width:60px;height:90px;" alt="Book Cover">
                <div class="card-body d-flex flex-column">
                  <strong class="card-title">{{ book.name }}</strong>
                  <span class="card-text">{{ book.author }}</span>
                  <span class="card-text">Duration: {{ formatDate(book.issue_date)}} - {{ formatDate(book.till_read_date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
    data() {
      return {
        issuedBooks: [],
        pendingBooks: [],
        readBooks: [],
      };
    },
    methods: {
      async fetchBooks() {
        try {
          // Fetch all book categories from the API
          const response = await fetch('/api/user/my-books', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token'),
            },
          });
          if (response.ok) {
            const data = await response.json();
            this.issuedBooks = data.issuedBooks;
            this.pendingBooks = data.pendingBooks;
            this.readBooks = data.readBooks;
          } else {
            console.error('Failed to fetch books');
          }
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      },
      async returnBook(bookId) {
        console.log(bookId);
        try {
          const response = await fetch(`/api/books/${bookId}/return`, {
            method: 'POST',
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token'),
            },
          });
          if (response.ok) {
            alert('Book returned successfully');
            this.fetchBooks(); // Refresh the list
          } else {
            console.error('Failed to return book');
          }
        } catch (error) {
          console.error('Error returning book:', error);
        }
      },
      getBookImageUrl(book) {
        
        return book.img_file ? `${this.ebookImageBaseUrl}${book.img_file}` : `${this.ebookImageBaseUrl}images.jpeg`; // Default image if none exists
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString(); // Format date to readable string
      }
    },
    created() {
      this.fetchBooks(); // Load books on component creation
    },
    computed: {
      ebookImageBaseUrl() {
        return '/static/ebook_pics/';
      }
    }
  };
  
