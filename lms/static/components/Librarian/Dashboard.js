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
            <div class=" row">
                <div v-for="ebook in ebooks" :key="ebook.id" class="col-md-3 mb-3">
                <div class="card w-75 h-100  border-0 shadow">
                
                    <img :src="getEbookImageUrl(ebook)" class="card-img-top w-50 mx-auto"  alt="E-book image">
                    
                    <div class="card-body text-center">
                        <strong class="card-title ">{{ ebook.name }}</strong>
                        <p class="card-text">Author: {{ ebook.author }}</p>
                        <p class="card-text">Section: {{ ebook.section.name }}</p>
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
            ebooks: []
        };
    },
    created() {
        this.fetchSections();
        this.fetchEbooks();
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
        getEbookImageUrl(ebook) {
            return ebook.img_file ? `${this.ebookImageBaseUrl}${ebook.img_file}` : `${this.ebookImageBaseUrl}images.jpeg`; // Use a default image if none exists
        },
    },
    computed:{
        ebookImageBaseUrl() {
            return '/static/ebook_pics/';
        }
    },
}
