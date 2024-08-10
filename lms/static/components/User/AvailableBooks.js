
export default {
    template: `
    <div class="container">
    <div class="row">
      <!-- Main Content Area (70%) -->
       <div class="col-md-9">
        <div class="row">
          <div v-for="book in availableBooks" :key="book.id" class="col-md-3 mb-4">
            <div class="card h-100 w-100">
                <img :src="getEbookImageUrl(book)" class="card-img-top mx-auto mt-2 d-block rounded-2 " style="width:100px;height:150px;" alt="Book Cover">
              <div class="card-body d-flex flex-column text-center">
                <strong class="card-title">{{ book.name }}</strong>
                <p class="card-text">{{ book.author }}</p>
                
                <div class="mt-auto  d-flex flex-column">
                <button @click="requestBook(book.id)" class="btn btn-primary ">Request</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information Area (30%) -->
      <div class="col-md-3">
        <h4>Additional Information</h4>
        <!-- Add any additional information or features here -->
        <p>Here you can add any extra details, such as book categories, announcements, or tips.</p>
      </div>
    </div>
  </div>

    `,
  data() {
    return {
      availableBooks: [],
    };
  },
  methods: {
    async fetchAvailableBooks() {
      try {
        const response = await fetch('/api/books/available', {
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        if (response.ok) {
          this.availableBooks = await response.json();
          
        } else {
          console.error('Failed to fetch available books');
        }
      } catch (error) {
        console.error('Error fetching available books:', error);
      }
    },
    async requestBook(bookId) {
      try {
        const response = await fetch(`/api/books/${bookId}/request`, {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        // console.log(response.status);
        if (response.ok) {
          alert('Book requested successfully');
          this.fetchAvailableBooks(); // Refresh the list
        }
        else if (response.status === 400) {
          alert('You have already requested this book');
        }
        
        else if (response.status === 410) {
          alert('You have reached the maximum limit of book requests');
        }
        else {
          console.error('Failed to request book');
        }
      } catch (error) {
        console.error('Error requesting book:', error);
      }
    },

    getEbookImageUrl(book) {
        return book.img_file ? `${this.ebookImageBaseUrl}${book.img_file}` : `${this.ebookImageBaseUrl}images.jpeg`; // Use a default image if none exists
    },

  },
  created() {
    this.fetchAvailableBooks(); // Load available books on component creation
  },
  computed:{
    ebookImageBaseUrl() {
        return '/static/ebook_pics/';
    }
},
};
