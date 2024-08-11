import router from "./router.js";
import Navbar from "./components/Navbar.js";






router.beforeEach((to, from, next) => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('auth-token') !== null;

    if (!isAuthenticated && (to.path === '/login' || to.path === '/register')) {
        next(); // Proceed
    } else if (!isAuthenticated && to.name !== 'Login') {
        next({ name: 'Login' }); // Redirect to login if not authenticated
    } else {
        next(); // Proceed to the route
    }
});





new Vue({
    el: '#app',
    template: `<div>
    <Navbar  :key='has_changed'/>
    <router-view /> </div>`,
    router,
    components: {
        Navbar,
    },
    data:{
        has_changed: true,
    },
    watch:{
        $route(to, from){
            this.has_changed = !this.has_changed
        },
    }
})