export default {
    template: `
    <div>
        <h3>Profile Details</h3>
        <div v-if="profile">
            <p><strong>Username:</strong> {{ profile.username }}</p>
            <p><strong>Email:</strong> {{ profile.email }}</p>
            <p><strong>Role:</strong> {{ profile.role }}</p>
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
        }
    }
}
