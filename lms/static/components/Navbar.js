

export default {
    template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container">
    <a class="navbar-brand" href="#">LMS</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
        </li>
        <li v-if="role==='user'" class="nav-item">
        <router-link class="nav-link active" aria-current="page" to="/user/dashboard/available-books">Books</router-link>
        </li>
        
        
      </ul>
      
      
      
      </div>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0 profile-menu" v-if="role"> 
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            
              <img :src="avatarUrl" class="rounded-circle" style="width: 30px; height: 30px;" />

             
        
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li v-if="role==='user'"><router-link class="dropdown-item" to="/profile/view"><i class="fas fa-sliders-h fa-fw"></i> Profile</router-link></li>
            <li v-if="role==='user'"><router-link class="dropdown-item" to="/user/dashboard/available-books"><i class="fas fa-sliders-h fa-fw"></i> User Dashboard</router-link></li>
            <li v-if="role==='librarian'"><router-link class="dropdown-item" to="/librarian/dashboard"><i class="fas fa-sliders-h fa-fw"></i> Librarian Dashboard</router-link></li>
            <li><a class="dropdown-item" href="#"><i class="fas fa-cog fa-fw"></i> Settings</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" v-if='is_login' @click='logout'><button class="fas fa-sliders-h fa-fw"></button> Logout</button></li>

          </ul>
        </li>
     </ul>
    </div>
  </div>
</nav>`,

data(){
    return {
        role:localStorage.getItem('user-role'),
        is_login:localStorage.getItem('auth-token'),
        profilePicUrl:'',
        
        

    }
},

created() {
  this.fetchProfile();
},

methods:{
  async fetchProfile() {
    if(this.role!=='user'){
      this.profilePicUrl =  '/static/avatar.png';
      return;
    }
    const res = await fetch('/api/profile', {
        headers: {
            "Authentication-Token": localStorage.getItem('auth-token')
        }
    });
    if (res.ok) {
        const profile = await res.json();
        this.profilePicUrl = profile.profile_pic ? `/static/profile_pics/${profile.profile_pic}` : '/static/avatar.png';
    }
    else {
        console.error("Failed to fetch profile");
        
        
    }
}

  ,
    logout(){
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user-role')
        this.$router.push('/login')
    },

    
},
computed:{
  avatarUrl(){
    return this.profilePicUrl
  }
}

}