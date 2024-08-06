import ViewUProfile from './ViewUProfile.js';
import EditUProfile from './EditUProfile.js';
// import ChangePassword from './ChangePassword.js';
// import IssuedBooks from './IssuedBooks.js';
// import Feedbacks from './Feedbacks.js';

export default {
    template: `
    <div>
      <h2>User Profile</h2>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <router-link to="/profile/view" class="nav-link" active-class="active">View Profile</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/edit" class="nav-link" active-class="active">Edit Profile</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/change-password" class="nav-link" active-class="active">Change Password</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/issued-books" class="nav-link" active-class="active">Issued Books</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/feedbacks" class="nav-link" active-class="active">Feedbacks</router-link>
        </li>
      </ul>
      <router-view></router-view>
    </div>
    `,
    data() {
        return {
            currentTab: 'view-profile'
        };
    },
    components: {
        ViewUProfile,
        EditUProfile,
        // ChangePassword,
        // IssuedBooks,
        // Feedbacks
    }
}
