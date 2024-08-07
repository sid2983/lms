import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Profile from './components/User/UserProfile.js'
import ViewUProfile from './components/User/ViewUProfile.js'
import EditUProfile from './components/User/EditUProfile.js'
import ChangeUPass from './components/User/ChangeUPass.js'
import IssuedBooks from './components/User/IssuedBooks.js'
import Feedbacks from './components/User/Feedbacks.js'
import LibrarianDashboard from './components/Librarian/LibrarianDashboard.js'
import SectionManagement from './components/Librarian/SectionManagement.js'
import EbookManagement from './components/Librarian/EbookManagement.js'
import Dashboard from './components/Librarian/Dashboard.js'





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
            // Add more routes as needed
        ]
    }




]

export default new VueRouter({
    routes,
})