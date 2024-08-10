
import AvailableBooks from './AvailableBooks.js';
import MyBooks from './MyBooks.js';
import Stats from './UStats.js';  

export default {
    template: `
    <div class="container">
      <ul class="nav nav-tabs my-3">
        <li class="nav-item">
          <router-link to="/user/dashboard/available-books" class="nav-link" active-class="active">Available Books</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/user/dashboard/my-books" class="nav-link" active-class="active">My Books</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/user/dashboard/stats" class="nav-link" active-class="active">Stats</router-link>
        </li>
      </ul>
      <router-view></router-view>
    </div>
    `,
    components: {
        AvailableBooks,
        MyBooks,
        Stats  // This will be implemented later
    }
}
