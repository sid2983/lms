import SectionManagement from './SectionManagement.js';
import EbookManagement from './EbookManagement.js';
import Dashboard from './Dashboard.js';
// Import other components as needed

export default {
    template: `
    <div class="container">
      <h2>Librarian Dashboard</h2>
      <ul class="nav nav-tabs my-3">

        <li class="nav-item">
          <router-link to="/librarian/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/librarian/sections" class="nav-link" active-class="active">Section Management</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/librarian/ebooks" class="nav-link" active-class="active">E-book Management</router-link>
        </li>
        
      </ul>
      <router-view></router-view>
    </div>
    `,
    components: {
        SectionManagement,
        EbookManagement,
        Dashboard
        // Include other components here
    }
}
