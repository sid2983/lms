

export default {
    template: `
    <div class="container">
    <div class="row">
      <!-- Main Content Area (70%) -->
       <div class="col-md-9">
        <div class="row">
          <div v-for="book in availableBooks" :key="book.id" class="col-md-3 mb-4">
            <div class="card h-100 w-100 border-0 rounded-1 shadow">
                <img :src="getEbookImageUrl(book)" class="card-img-top mx-auto mt-2 d-block rounded-2 " style="width:100px;height:150px;" alt="Book Cover">
              <div class="card-body d-flex flex-column text-center">
                <strong class="card-title">{{ book.name }}</strong>
                <p class="card-text">{{ book.author }}</p>
                
                <div class="mt-auto  d-flex flex-column">
                <button @click="requestBook(book.id) " class="btn btn-primary ">Request</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
      <!-- Additional Information Area (30%) -->
      <div class="col-md-3 border-0 shadow card pt-3 px-3 searchbar ">
      
         <form class="d-flex w-100" role="search" @submit.prevent="fetchAvailableBooks">
        <input v-model="searchQuery"  class="form-control me-2" type="search" placeholder="Search " aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>

        <!-- Add any additional information or features here -->
        <span class="pt-1">Here you can search for any book or section you want to read. You can also request for the book you want to read.</span>
      </div>
    </div>
  </div>

    `,
  data() {
    return {
      availableBooks: [],
      searchQuery: ''
    };
  },
  methods: {
    async fetchAvailableBooks() {
      console.log(this.searchQuery);
      try {
        const response = await fetch(`/api/books/available?search=${this.searchQuery}`, {
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
    filterBooks(books, query) {
      return books.filter(book => 
          book.name.toLowerCase().includes(query.toLowerCase()) || 
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.section?.name.toLowerCase().includes(query.toLowerCase())
      );
  }
    

  },
  created() {
    this.fetchAvailableBooks();
    
    
  },
  
  computed:{
    ebookImageBaseUrl() {
        return '/static/ebook_pics/';
    },
    filteredBooks() {
      return this.filterBooks(this.availableBooks, this.searchQuery);
    }
},
};
