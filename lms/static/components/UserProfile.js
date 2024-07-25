import ViewUProfile from './ViewUProfile.js';
// import EditProfile from './EditProfile.js';
// import ChangePassword from './ChangePassword.js';
// import IssuedBooks from './IssuedBooks.js';
// import Feedbacks from './Feedbacks.js';

export default {
    template: `
    <div>
        <h2>User Profile</h2>
        <ul class="nav nav-tabs">
            <li class="nav-item" @click="currentTab = 'view-profile'"><a class="nav-link" href="#">View Profile</a></li>
            <li class="nav-item" @click="currentTab = 'edit-profile'"><a class="nav-link" href="#">Edit Profile</a></li>
            <li class="nav-item" @click="currentTab = 'change-password'"><a class="nav-link" href="#">Change Password</a></li>
            <li class="nav-item" @click="currentTab = 'issued-books'"><a class="nav-link" href="#">Issued Books</a></li>
            <li class="nav-item" @click="currentTab = 'feedbacks'"><a class="nav-link" href="#">Feedbacks</a></li>
        </ul>
        <div v-if="currentTab === 'view-profile'">
            <ViewUProfile />
        </div>
        
    </div>
    `,
    data() {
        return {
            currentTab: 'view-profile'
        };
    },
    components: {
        ViewUProfile,
        // EditProfile,
        // ChangePassword,
        // IssuedBooks,
        // Feedbacks
    }
}
