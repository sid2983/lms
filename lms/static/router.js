import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Profile from './components/UserProfile/UserProfile.js'
import ViewUProfile from './components/UserProfile/ViewUProfile.js'
import EditUProfile from './components/UserProfile/EditUProfile.js'
import ChangeUPass from './components/UserProfile/ChangeUPass.js'
import IssuedBooks from './components/UserProfile/IssuedBooks.js'
import Feedbacks from './components/UserProfile/Feedbacks.js'
import LibrarianDashboard from './components/Librarian/LibrarianDashboard.js'
import SectionManagement from './components/Librarian/SectionManagement.js'
import EbookManagement from './components/Librarian/EbookManagement.js'
import Dashboard from './components/Librarian/Dashboard.js'
import Requests from './components/Librarian/Requests.js'
import Stats from './components/Librarian/Stats.js'
import UserDashboard from './components/User/UserDashboard.js'
import AvailableBooks from './components/User/AvailableBooks.js'
import MyBooks from './components/User/MyBooks.js'
import UStats from './components/User/UStats.js'





const routes = [
    {path: '/', component: Home },
    {path: '/login', component: Login, name:'Login'},
    {path: '/register', component: Register},
    
    {
        path: '/profile',
        component: Profile,
        children: [
          { path: 'view', component: ViewUProfile },
          { path: 'edit', component: EditUProfile },
          { path: 'change-password', component: ChangeUPass },
          { path: 'issued-books', component: IssuedBooks },
          { path: 'feedbacks', component: Feedbacks },
        ]
      },

      {
        path: '/librarian',
        component: LibrarianDashboard,
        children: [
            {path: 'dashboard', component: Dashboard},
            { path: 'sections', component: SectionManagement },
            { path: 'ebooks', component: EbookManagement },
            { path: 'requests', component: Requests },
            { path: 'stats', component: Stats }
            // Add more routes as needed
        ]
    },

    {
      path: '/user/dashboard',
      component: UserDashboard,
      children: [
          { path: 'available-books', component: AvailableBooks },
          { path: 'my-books', component: MyBooks },
          { path: 'stats', component: UStats },  // Stats to be implemented later
      ]
    },





]

export default new VueRouter({
    routes,
})