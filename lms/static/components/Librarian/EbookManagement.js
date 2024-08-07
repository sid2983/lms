



export default {
    template: `
    <div>
    <div class="my-4 border-0 shadow p-4 rounded-1 newform container">
        <h3>E-book Management</h3>
        <form @submit.prevent="addEbook" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="ebookTitle" class="form-label">E-book Title</label>
                <input
                    type="text"
                    class="form-control"
                    id="ebookTitle"
                    v-model="newEbookTitle"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="ebookAuthor" class="form-label">Author</label>
                <input
                    type="text"
                    class="form-control"
                    id="ebookAuthor"
                    v-model="newEbookAuthor"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="ebookSection" class="form-label">Section</label>
                <select
                    class="form-control"
                    id="ebookSection"
                    v-model="selectedSection"
                    required
                >
                    <option v-for="section in sections" :key="section.id" :value="section.id">
                        {{ section.name }}
                    </option>
                </select>
            </div>

            <div class="mb-3">
                <label for="ebookImgFile" class="form-label">Image File</label>
                <input
                    type="file"
                    class="form-control"
                    id="ebookImgFile"
                    @change="handleFileChange('new', $event)"
                />
            </div>
            

            <button type="submit" class="btn btn-primary">Add E-book</button>
        </form>
        </div>
        
    <hr>
        <div v-if="ebooks.length" class="my-5 container">
            <h4>Existing E-books</h4>
            <div class=" row">
                <div v-for="ebook in ebooks" :key="ebook.id" class="col-md-3 mb-3">
                <div class="card w-75 h-100  border-0 shadow">
                
                    <img :src="getEbookImageUrl(ebook)" class="card-img-top w-50 mx-auto"  alt="E-book image">
                    
                    <div class="card-body text-center">
                        <strong class="card-title ">{{ ebook.name }}</strong>
                        <p class="card-text">Author: {{ ebook.author }}</p>
                        <p class="card-text">Section: {{ ebook.section.name }}</p>
                    </div>
                     <div class="card-footer mt-auto border-0">
                    <button @click="openEditModal(ebook)" class="btn btn-secondary btn-sm">Edit</button>
                    <button @click="deleteEbook(ebook.id)" class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </div>
                </div>
                
            </div>
            
        </div>

        <!-- Custom Edit Modal -->
        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <h5>Edit E-book</h5>
                <form @submit.prevent="updateEbook" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="editEbookTitle">E-book Title</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="editEbook.name"
                            id="editEbookTitle"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="editEbookAuthor">Author</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="editEbook.author"
                            id="editEbookAuthor"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="editEbookSection">Section</label>
                        <select
                            class="form-control"
                            v-model="editEbook.section_id"
                            id="editEbookSection"
                            required
                        >
                            <option v-for="section in sections" :key="section.id" :value="section.id">
                                {{ section.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editEbookImgFile">Image File</label>
                        <input
                            type="file"
                            class="form-control"
                            @change="handleFileChange('edit', $event)"
                        />
                    </div>
                    <button type="submit" class="btn btn-primary">Save changes</button>
                    <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            newEbookTitle: '',
            newEbookAuthor: '',
            newEbookImgFile: null,
            selectedSection: '',
            sections: [], // Replace with actual data fetching
            ebooks: [], // Replace with actual data fetching
            showEditModal: false,
            editEbook: {},
            editEbookImgFile: null
        };
    },
    methods: {

        handleFileChange(type, event) {
            if (event && event.target && event.target.files) {
                if (type === 'new') {
                    this.newEbookImgFile = event.target.files[0];
                } else if (type === 'edit') {
                    this.editEbookImgFile = event.target.files[0];
                }
                console.log('File selected');
            }
            else{
                console.log('No file selected');
            
            }
        },

        async fetchSections() {
            // Fetch existing sections from the backend
            try {
                const response = await fetch('/api/sections', {
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
        async addEbook() {
            // Add a new e-book to the backend
            try {
                const formData = new FormData();
                formData.append('title', this.newEbookTitle);
                formData.append('author', this.newEbookAuthor);
                formData.append('section_id', this.selectedSection);
                if (this.newEbookImgFile) {
                    formData.append('img_file', this.newEbookImgFile);
                }
                console.log(formData);
                console.log(this.newEbookImgFile);
                console.log(this.newEbookTitle);
                console.log(this.newEbookAuthor);
                console.log(this.selectedSection);
                const response = await fetch('/api/ebooks', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: formData
                });

                if (response.ok) {
                    this.newEbookTitle = '';
                    this.newEbookAuthor = '';
                    this.selectedSection = '';
                    this.newEbookImgFile = null;
                    this.fetchEbooks(); // Refresh the e-book list
                } else {
                    console.error('Failed to add e-book');
                }
            } catch (error) {
                console.error('Error adding e-book:', error);
            }
        },
        openEditModal(ebook) {
            this.editEbook = { ...ebook };
            this.showEditModal = true;
        },
        closeEditModal() {
            this.showEditModal = false;
            this.editEbook = {};
            this.editEbookImgFile = null;
        },
        async updateEbook() {
            // Update e-book details
            try {
                const formData = new FormData();
                formData.append('title', this.editEbook.name);
                formData.append('author', this.editEbook.author);
                formData.append('section_id', this.editEbook.section_id);
                if (this.editEbookImgFile) {
                    formData.append('img_file', this.editEbookImgFile);
                }

                const response = await fetch(`/api/ebooks/${this.editEbook.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: formData
                });

                if (response.ok) {
                    this.closeEditModal();
                    this.fetchEbooks(); // Refresh the e-book list
                } else {
                    console.error('Failed to update e-book');
                }
            } catch (error) {
                console.error('Error updating e-book:', error);
            }
        },
        async deleteEbook(id) {
            // Delete an e-book from the backend
            try {
                const response = await fetch(`/api/ebooks/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    }
                });

                if (response.ok) {
                    this.fetchEbooks(); // Refresh the e-book list
                } else {
                    console.error('Failed to delete e-book');
                }
            } catch (error) {
                console.error('Error deleting e-book:', error);
            }
        },
        getEbookImageUrl(ebook) {
            return ebook.img_file ? `${this.ebookImageBaseUrl}${ebook.img_file}` : `${this.ebookImageBaseUrl}images.jpeg`; // Use a default image if none exists
        },
    },
    created() {
        this.fetchSections(); // Load sections on component creation
        this.fetchEbooks(); // Load e-books on component creation
    },
    computed:{
        ebookImageBaseUrl() {
            return '/static/ebook_pics/';
        }
    },
}
