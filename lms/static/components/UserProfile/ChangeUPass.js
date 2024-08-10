export default {
    template: `
      <div>
        <h2>Change Password</h2>
        <form @submit.prevent="changePassword">
          <div class="mb-3">
            <label for="currentPassword" class="form-label">Current Password</label>
            <input
              type="password"
              class="form-control"
              id="currentPassword"
              v-model="currentPassword"
              required
            />
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">New Password</label>
            <input
              type="password"
              class="form-control"
              id="newPassword"
              v-model="newPassword"
              required
            />
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm New Password</label>
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="confirmPassword"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Change Password</button>
        </form>
      </div>
    `,
    data() {
      return {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    methods: {
      async changePassword() {
        if (this.newPassword !== this.confirmPassword) {
          alert('New passwords do not match!');
          return;
        }
  
        // Prepare form data
        const formData = new FormData();
        formData.append('current_password', this.currentPassword);
        formData.append('new_password', this.newPassword);
  
        // Send the data to the backend (URL and method will be adjusted later)
        try {
          const response = await fetch('/api/change-password', {
            method: 'PUT',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            }
          });
  
          if (response.ok) {
            alert('Password changed successfully');
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
          } else {
            alert('Failed to change password');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while changing the password');
        }
      }
    }
  };
  