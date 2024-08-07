export default {
    template: `
    <div>
        <h2>Edit Profile</h2>
        <div class="mb-3 p-6 bg-light">
        <form @submit.prevent="saveProfile" enctype="multipart/form-data">
           

                <label for="exampleFormControlInput1" class="form-label">Username</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" 
                v-model="profile.username">

                <label for="exampleFormControlInput2" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleFormControlInput2" 
                v-model="profile.email">

                <div>
                    <label for="exampleFormControlInput3" class="form-label">Profile Picture</label>
                    <input type="file" class="form-control" id="exampleFormControlInput3" @change="handleFileChange" />
                </div>
            

            <button type="submit" class="btn btn-primary mt-3" >Save</button>
        </form>
        </div>
    </div>
    `,
    data() {
        return {
            profile: {
                username: null,
                email: null,
                profile_pic: null
            },
            selectedFile: null
        }
    },
    created() {
        this.fetchProfile();
    },
    methods: {
        async fetchProfile() {
            const res = await fetch('/api/profile', {
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            });
            if (res.ok) {
                this.profile = await res.json();
            }
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async saveProfile() {
            const formData = new FormData();
            formData.append('username', this.profile.username);
            formData.append('email', this.profile.email);
            
            if (this.selectedFile) {
                formData.append('profile_pic', this.selectedFile);
            }
            console.log(this.selectedFile);
            console.log(this.profile.username,this.profile.email);
            const res = await fetch('/api/profile/edit', {
                method: 'PUT',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body: formData
            });
            if (res.ok) {
                this.$router.push('/profile/view');
            }
        }
    }
}
