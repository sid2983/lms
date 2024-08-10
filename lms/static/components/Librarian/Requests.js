

export default {
  template: `
            
  <div class="container">
    <div class="row">
      <!-- Pending Requests (Horizontal Cards) -->
      <div class="col-md-12">
        <h4>Pending Requests</h4>
        <div class="row">
          <div v-for="request in pendingRequests" :key="request.id" class="col-md-12 mb-4">
            <div class="card h-100 w-100 d-flex flex-row">
              <img :src="getBookImageUrl(request.book)" class="card-img-left mx-2 my-auto rounded-2" style="width:60px;height:90px;" alt="Book Cover">
              <div class="card-body d-flex flex-column">
                <strong class="card-title">{{ request.book.name }}</strong>
                <p class="card-text">{{ request.book.author }}</p>
                <p class="card-text">Requested Date: {{ formatDate(request.request_date) }}</p>
                <button @click="grantAccess(request.id)" class="btn btn-success mt-auto">Grant Access</button>
                <button @click="cancelRequest(request.id)" class="btn btn-danger mt-auto">Cancel Request</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Issued Books (Horizontal Cards) -->
      <div class="col-md-12">
        <h4>Issued Books</h4>
        <div class="row">
          <div v-for="book in issuedBooks" :key="book.id" class="col-md-12 mb-4">
            <div class="card h-100 w-100 d-flex flex-row">
              <img :src="getBookImageUrl(book)" class="card-img-left mx-2 my-auto rounded-2" style="width:60px;height:90px;" alt="Book Cover">
              <div class="card-body d-flex flex-column">
                <strong class="card-title">{{ book.name }}</strong>
                <p class="card-text">{{ book.author }}</p>
                <p class="card-text">Issued Date: {{ formatDate(book.issue_date) }}</p>
                <p class="card-text">Return Date: {{ formatDate(book.return_date) }}</p>
                <button v-if="book.canBeRevoked" @click="revokeAccess(book.id)" class="btn btn-warning mt-auto">Revoke Access</button>
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
        const response = await fetch('/api/librarian/requests', {
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.pendingRequests = data.pendingRequests;
          this.issuedBooks = data.issuedBooks;
        } else {
          console.error('Failed to fetch requests and issued books');
        }
      } catch (error) {
        console.error('Error fetching requests and issued books:', error);
      }
    },
    async grantAccess(requestId) {
      try {
        const response = await fetch(`/api/librarian/requests/${requestId}/grant`, {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
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
      try {
        const response = await fetch(`/api/librarian/requests/${requestId}/cancel`, {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
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
      try {
        const response = await fetch(`/api/librarian/books/${bookId}/revoke`, {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
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
    getBookImageUrl(book) {
      return book.img_file ? `${this.ebookImageBaseUrl}${book.img_file}` : `${this.ebookImageBaseUrl}images.jpeg`; // Default image if none exists
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

