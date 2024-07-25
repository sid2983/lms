export default {
    template: `
    <div>
        <h3>Profile Details</h3>
        <div v-if="profile">
            <p><strong>Username:</strong> {{ profile.username }}</p>
            <p><strong>Email:</strong> {{ profile.email }}</p>
            <p><strong>Role:</strong> {{ profile.role }}</p>
            <div class="profile-pic">
              <img :src="avatarUrl">

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
            return this.profile.profile_pic ? `/static/${this.profile.profile_pic}` : null;

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


