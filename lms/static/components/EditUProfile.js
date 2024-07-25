export default {
    template: `
    <div>
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile">
            <div>
                <label>Username:</label>
                <input v-model="profile.username" type="text" />
            </div>
            <div>
                <label>Email:</label>
                <input v-model="profile.email" type="email" />
            </div>
            <button type="submit">Save</button>
        </form>
    </div>
    `,
    data() {
        return {
            profile: {
                username: null,
                email: null
            }
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
        async saveProfile() {
            const res = await fetch('/api/profile/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify(this.profile)
            });
            if (res.ok) {
                this.$router.push('/profile');
            }
        }
    }
}
