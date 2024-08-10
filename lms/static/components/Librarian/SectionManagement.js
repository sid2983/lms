export default {
    template: `
    <div>
    <div class="my-4 border-0 shadow p-4 rounded-1 newform container">
        <h4 class="p-3">Add Section</h4>
        <form @submit.prevent="addSection" class="">
            <div class="mb-3">
                <label for="sectionName" class="form-label">Name</label>
                <input
                    type="text"
                    class="form-control"
                    id="sectionName"
                    v-model="newSectionName"
                    required
                />
                <label for="sectionDesc" class="form-label">Description</label>
                <input
                    type="text"
                    class="form-control"
                    id="sectionDesc"
                    v-model="newSectionDesc"
                    required
                />

            </div>
            <button type="submit" class="btn btn-primary">Add Section</button>
        </form>
    </div>

        <hr>

    <div v-if="sections.length" class="my-5 container">
      <h4 >Existing Sections</h4><br>
      
      <div class="row">
        <div v-for="section in sections" :key="section.id" class="col-md-4 mb-3">
        <div class="card h-100  d-flex flex-column border-0 shadow">
        <div class="card-body d-flex flex-column flex-grow-1">
          <h5 class="card-title">{{ section.name }}</h5>
            <br>
            <p class="card-text">{{ section.description }}</p>
        </div>
        <div class="card-footer mt-auto border-0">
          <button @click="openEditModal(section)" class="btn btn-secondary btn-sm">Edit</button>
          <button @click="prepareDelete(section.id)" class="btn btn-danger btn-sm">Delete</button>
        </div>
          </div>
        </div>
        </div>
        
      
    </div>

    <!-- Custom Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Section</h5>
          <button type="button" class="close float-end" @click="closeEditModal">&times;</button>
        </div>
        <div class="modal-body ">
          <form @submit.prevent="updateSection">
            <div class=" form-group">
              <label for="editSectionName">Section Name</label><br>
              <input
                type="text"
                class="form-control"
                v-model="editSection.name"
                id="editSectionName"
                required
              />
            </div>
            <br>
            <div class="form-group">
                            <label for="editSectionDesc">Section Description</label>
                            <input
                                type="text"
                                class="form-control"
                                v-model="editSection.description"
                                id="editSectionDesc"
                                required
                            />
            </div>
            <br>

            <button type="submit" class="btn btn-primary">Save changes</button>
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
          </form>
        </div>
      </div>
    </div>


    <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Section</h5>
                    <button type="button" class="close float-end" @click="cancelDelete">&times;</button>
                </div>
                <div class="modal-body">
                    <p>This section has some books. Do you really want to delete the section? If you do, the books related to this section will also be purged.</p>
                </div>
                <div class="modal-footer">
                    <button @click="confirmDelete" class="btn btn-danger">Yes, Delete</button>&nbsp;&nbsp;&nbsp;
                    <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
        
    </div>
    `,
    data() {
        return {
            newSectionName: '',
            newSectionDesc: '',
            sections: [] ,
            showEditModal: false,
            showDeleteModal: false,
            editSection: {},
            sectionToDelete: null,
        };
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
        async addSection() {
            try {
                const formData = new FormData();
                formData.append('name', this.newSectionName);
                formData.append('description', this.newSectionDesc);
                

                const response = await fetch('/api/sections', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: formData
                });

                if (response.ok) {
                    this.newSectionName = '';
                    this.newSectionDesc = '';
                    this.fetchSections(); // Refresh the section list
                } else {
                    console.error('Failed to add section');
                }
            } catch (error) {
                console.error('Error adding section:', error);
            }
        },
        openEditModal(section) {
            this.editSection = { ...section };
            this.showEditModal = true;
          },
          closeEditModal() {
            this.showEditModal = false;
            this.editSection = {};
          },
        async updateSection() {
            // Implement edit functionality here
            try {
                const formData = new FormData();
                formData.append('name', this.editSection.name);
                formData.append('description', this.editSection.description);
    
                const response = await fetch(`/api/sections/${this.editSection.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: formData
                });
    
                if (response.ok) {
                    this.closeEditModal();
                    this.fetchSections(); // Refresh the section list
                } else {
                    console.error('Failed to update section');
                }
            } catch (error) {
                console.error('Error updating section:', error);
            }
            
        },
        prepareDelete(id) {
            // Store the section ID and show the confirmation modal
            this.sectionToDelete = id;
            this.showDeleteModal = true;
        },
        

        async confirmDelete() {
            try {
                const response = await fetch(`/api/sections/${this.sectionToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token')
                    }
                });

                if (response.ok) {
                    this.fetchSections(); // Refresh the section list
                } else {
                    console.error('Failed to delete section and books');
                }
            } catch (error) {
                console.error('Error deleting section and books:', error);
            } finally {
                // Close the modal
                this.showDeleteModal = false;
                this.sectionToDelete = null;
            }
        },
        cancelDelete() {
            // Close the modal without deleting
            this.showDeleteModal = false;
            this.sectionToDelete = null;
        }
    },
    created() {
        this.fetchSections(); // Load sections on component creation
    }
}
