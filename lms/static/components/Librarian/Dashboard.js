export default {
    template: `
    <div>
        <div>
            <h4>All Sections</h4>
            <div class="row">
                <div v-for="section in sections" :key="section.id" class="col-md-4 mb-3">
                <div class="card h-100  d-flex flex-column border-0 shadow">
                <div class="card-body d-flex flex-column flex-grow-1">
                <h5 class="card-title">{{ section.name }}</h5>
                    <br>
                    <p class="card-text">{{ section.description }}</p>
                </div>
        
          </div>
        </div>
        </div>
        </div>
        <hr>
        <div>
            <h4>All E-books</h4>
            <div class=" row d-flex flex-row">
                <div v-for="ebook in ebooks" :key="ebook.id" class="col-md-3 mb-3 d-flex flex-column">
                <div class="card w-75 h-100  border-0 shadow">
                
                    <img :src="getEbookImageUrl(ebook)" class="card-img-top w-50 mx-auto mt-2 border-0 rounded-1" style="width:80px;height:150px"  alt="E-book image">
                    
                    <div class="card-body text-center">
                        <strong class="card-title ">{{ ebook.name }}</strong><br>
                        <span class="card-text">{{ ebook.author }}</span><br>
                        
                    </div>
                     
                </div>
                </div>
                
            </div>
        </div>

        <hr>
        <div>
        <h4> All users </h4>
            <div class="row">

                <div class="col-md-12">
        
        <div class="row d-flex flex-row">
          <div v-for="user in users" :key="user.id" class="col-md-3 mb-4">
            <div class="card h-100 w-100 d-flex flex-column border-0 shadow justify-content-center text-center align-content-center align-items-center px-3 pt-3">
              <img :src="getUserProfilePic(user.profile_pic)" class="card-img-left  my-auto rounded-circle" style="width:80px;height:80px;" alt="Book Cover">
                <div class="card-body d-flex flex-column">
                  <strong class="card-title">{{ user.username }}</strong>
                  <span class="card-text">{{ user.email }}</span>
                    <div class='p-2'>
                        <button class="btn btn-outline-primary mt-3 ">Books 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                            <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                            </svg>
                        </button>
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
            sections: [],
            ebooks: [],
            users: [],
            showUserModal: false,
        };
    },
    created() {
        this.fetchSections();
        this.fetchEbooks();
        this.fetchUsers();
    },
    methods: {
        async fetchSections() {
            try {
                const response = await fetch('/api/sections',{
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    }
            });
                if (response.ok) {
                    this.sections = await response.json();
                } else {
                    console.error('Failed to fetch sections');
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        },
        async fetchEbooks() {
            // Fetch existing e-books from the backend
            try {
                const response = await fetch('/api/ebooks',{
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    }
                    
                });
                if (response.ok) {
                    this.ebooks = await response.json();
                    
                    
                } else {
                    console.error('Failed to fetch e-books');
                }
            } catch (error) {
                console.error('Error fetching e-books:', error);
            }
        },

        async fetchUsers() {
            try {
              const response = await fetch('/api/librarian/users', {
                headers: {
                  'Authentication-Token': localStorage.getItem('auth-token')
                }
              });
              if (response.ok) {
                const data = await response.json();
                this.users = data;
                console.log('Users:', this.users);
              } else {
                console.error('Failed to fetch users');
              }
            } catch (error) {
              console.error('Error fetching users:', error);
            }
          },

        getEbookImageUrl(ebook) {
            return ebook.img_file ? `${this.ebookImageBaseUrl}${ebook.img_file}` : `${this.ebookImageBaseUrl}images.jpeg`; // Use a default image if none exists
        },
        getUserProfilePic(profilePic) {
            return profilePic ? `/static/profile_pics/${profilePic}` : '/static/profile_pics/avatar.png';
        },




    },
    computed:{
        ebookImageBaseUrl() {
            return '/static/ebook_pics/';
        }
    },
}
