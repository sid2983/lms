import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Profile from './components/UserProfile.js'




const routes = [
    {path: '/', component: Home },
    {path: '/login', component: Login, name:'Login'},
    {path: '/register', component: Register},
    {path: '/profile', component: Profile},

]

export default new VueRouter({
    routes,
})