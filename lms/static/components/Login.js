export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top:15vh">
    
        <div class="mb-3 p-5 bg-light">
        <div class="text-danger">{{error}}</div>
            <label for="exampleFormControlInput1" class="form-label">Email address</label>
            <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"
            v-model='cred.email'>

            <label for="inputPassword5" class="form-label">Password</label>
            <input type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock"
            v-model='cred.password'>

            <div class="d-flex mt-3 justify-content-center">
                <button class="btn btn-primary " @click='login'>Login</button>
            </div>

            Not a registered user? Register <router-link to="/register">here</router-link>
            
        </div>
    </div>

`,
data(){
    return {
        cred:{
            email: null,
            password: null,
        },
        error:null,

    }
    
},
methods:{
    async login(){
        console.log(this.cred)
        const res = await fetch('/api/user_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cred),
        })
        const data = await res.json()
        if(res.ok){
            
            if(data.token){
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('user-role', data.role)
                
                this.$router.push({ path:'/'})
                // if condition ---->
            }
            console.log(data)
            // console.log(localStorage.getItem('profile-pic-url'))
            
        }
        else {
            
            this.error = data.message
            console.error(data.message)
    }

}
}
}