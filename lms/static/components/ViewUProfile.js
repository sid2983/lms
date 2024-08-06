export default {
    template: `
    <div class=" m-2 p-5 w-75">
        

        <div class="card mb-3 " v-if="profile">
            <img :src="barImg" style="height:10rem" class="card-img-top" alt="...">
            <div class="card-body d-flex">
                <div class="p-2">
                    <img :src="avatarUrl" class="rounded-circle" style="width: 100px; height: 100px;" />

                </div>
                <div class="p-2">
                    <h5 class="card-title">{{ profile.username }}</h5>
                    <p class="card-text"><strong>Email:</strong> {{ profile.email }}</p>
                    <p class="card-text"><strong>Role</strong> {{ profile.role }}</p>
                </div>
            </div>
        </div>
        
    </div>
    `,
    data() {
        return {
            profile: null
        };
    },
    created() {
        this.fetchProfile();
    },

    computed: {
        avatarUrl() {
            return this.profile.profile_pic ? `/static/profile_pics/${this.profile.profile_pic}` : null;

        },
        barImg(){
            return "/static/bar.jpg"
        }
    },

    methods: {
        async fetchProfile() {
            const res = await fetch('/api/profile', {
                headers: {
                    "Authentication-Token": localStorage.getItem('auth-token')
                }
            });
            if (res.ok) {
                this.profile = await res.json();
            }
            else {
                console.error("Failed to fetch profile");
                
            }
        }
    }
}


