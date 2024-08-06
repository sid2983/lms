import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Profile from './components/UserProfile.js'
import ViewUProfile from './components/ViewUProfile.js'
import EditUProfile from './components/EditUProfile.js'




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
          // { path: 'change-password', component: ChangePassword },
          // { path: 'issued-books', component: IssuedBooks },
          // { path: 'feedbacks', component: Feedbacks },
        ]
      },


]

export default new VueRouter({
    routes,
})