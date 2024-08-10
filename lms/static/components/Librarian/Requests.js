export default {
  template: `
  <div class="container">
    <div class="row">
      <!-- Pending Requests (Horizontal Cards) -->
      <div class="col-md-12">
        <h4>Pending Requests</h4>
        <div class="row">

        
          <div v-for="request in pendingRequests" :key="request.id" class="col-md-12 mb-4">
          
            <div class="card h-100 w-100 d-flex flex-row border-0 shadow">
              <div class="row flex-nowrap w-100">
                <div class="col-md-10 d-flex flex-column justify-content-between">
                  <div class="d-flex flex-row">
                    <img :src="getBookImageUrl(request.img_file)" class="card-img-left mx-2 my-auto rounded-2" style="width:60px;height:90px;" alt="Book Cover">
                      <div class="card-body d-flex flex-column">
                        <strong class="card-title">{{ request.book_name }}</strong>
                        <span class="card-text">{{ request.book_author }}</span>
                        <span class="card-text">Requested By: <b>{{ request.username }}</b></span>
                        <span class="card-text">Requested Date: {{ formatDate(request.request_date) }}</span>
                      
                      </div>
                  </div>
                </div>
                <div class="col-md-2 d-flex flex-column align-items-end">
                      <button @click="grantAccess(request.id)" class="btn btn-success mt-auto mb-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                        </svg>
                      </button>
                      <button @click="cancelRequest(request.id)" class="btn btn-danger mb-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                      </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    

          <!-- Issued Books (Horizontal Cards) -->
      <div class="col-md-12">
        <h4>Issued Books</h4>
        <div class="row d-flex flex-row">
          <div v-for="book in issuedBooks" :key="book.id" class="col-md-3 mb-4">
            <div class="card h-100 w-100 d-flex flex-row border-0 shadow">
              <img :src="getBookImageUrl(book.img_file)" class="card-img-left mx-2 my-auto rounded-2" style="width:80px;height:110px;" alt="Book Cover">
                <div class="card-body d-flex flex-column">
                  <strong class="card-title">{{ book.book_name }}</strong>
                  <span class="card-text">{{ book.book_author }}</span>
                  <span class="card-text">Issued To: <b>{{ book.username }}</b></span>
                  <span class="card-text">Issued Date: {{ formatDate(book.issue_date) }}</span>
                  <span class="card-text"> Expected Return Date: {{ formatDate(book.expected_return_date) }}</span>
                  <div class="p-2">
                  <button v-if="book.status === 'active'" @click="revokeAccess(book.id)" class="btn btn-outline-warning ">Revoke Access</button>
                  <button v-if="book.status === 'returned' || book.status === 'revoked'" class="btn btn-outline-danger" style="pointer-events: none;"> Returned </button>
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
      pendingRequests: [],
      issuedBooks: [],
    };
  },
  methods: {
    async fetchRequestsAndIssuedBooks() {
      try {
        // Fetch all requests and issued books from the API
        const requestsResponse = await fetch('/api/librarian/requests', {
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        // console.log(requestsResponse);
        const issuedBooksResponse = await fetch('/api/librarian/issued-books', {
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        // console.log(issuedBooksResponse);
        if (requestsResponse.ok && issuedBooksResponse.ok) {
          const requestsData = await requestsResponse.json();
          
          this.pendingRequests = requestsData;
          const issuedBooksData = await issuedBooksResponse.json();
          this.issuedBooks = issuedBooksData;
          console.log(requestsData,"requestsData");
          console.log(this.pendingRequests);
        } else {
          console.error('Failed to fetch requests or issued books');
        }
      } catch (error) {
        console.error('Error fetching requests and issued books:', error);
      }
    },
    async grantAccess(requestId) {
      console.log(requestId);
      try {
        const response = await fetch('/api/librarian/requests', {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: requestId,
            action: 'grant',
          }),
        });
        if (response.ok) {
          alert('Access granted successfully');
          this.fetchRequestsAndIssuedBooks(); // Refresh the list
        } else {
          console.error('Failed to grant access');
        }
      } catch (error) {
        console.error('Error granting access:', error);
      }
    },
    async cancelRequest(requestId) {
      console.log(requestId);
      try {
        const response = await fetch('/api/librarian/requests', {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: requestId,
            action: 'cancel',
          }),
        });
        if (response.ok) {
          alert('Request canceled successfully');
          this.fetchRequestsAndIssuedBooks(); // Refresh the list
        } else {
          console.error('Failed to cancel request');
        }
      } catch (error) {
        console.error('Error canceling request:', error);
      }
    },
    async revokeAccess(bookId) {
      console.log(bookId);
      try {
        const response = await fetch('/api/librarian/issued-books', {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            issued_book_id: bookId,
            action: 'revoke',
          }),
        });
        if (response.ok) {
          alert('Access revoked successfully');
          this.fetchRequestsAndIssuedBooks(); // Refresh the list
        } else {
          console.error('Failed to revoke access');
        }
      } catch (error) {
        console.error('Error revoking access:', error);
      }
    },
    getBookImageUrl(img_file) {
      return img_file ? `${this.ebookImageBaseUrl}${img_file}` : `${this.ebookImageBaseUrl}images.jpeg`; // Default image if none exists
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(); // Format date to readable string
    }
  },
  created() {
    this.fetchRequestsAndIssuedBooks(); // Load requests and issued books on component creation
  },
  computed: {
    ebookImageBaseUrl() {
      return '/static/ebook_pics/';
    }
  }
};
