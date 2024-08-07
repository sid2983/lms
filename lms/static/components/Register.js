export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top:15vh">
    
        <div class="mb-3 p-5 bg-light">
        <div class="text-danger">{{regerror}}</div>
            <label for="exampleFormControlInput1" class="form-label">Username</label>
            <input type="text" class="form-control" id="exampleFormControlInput1" 
            v-model='cred.username'>

            <label for="exampleFormControlInput2" class="form-label">Email address</label>
            <input type="email" class="form-control" id="exampleFormControlInput2" placeholder="name@example.com"
            v-model='cred.email'>

            <label for="inputPassword5" class="form-label">Password</label>
            <input type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock"
            v-model='cred.password'>

            <div class="d-flex mt-3 justify-content-center">
                <button class="btn btn-primary " @click='register'>Register</button>
            </div>

            Already a registered user? Login <router-link to="/login">here</router-link>
        </div>
    </div>

`,
data(){
    return {
        cred:{
            username: null,
            email: null,
            password: null,
        },
        regerror:null,

    }
    
},
methods:{
    async register(){
        console.log(this.cred)
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cred),
        })
        const data = await res.json()
        if(res.ok){
            
            
            this.$router.push({ path:'/login'})
                
            
            
        }
        else {
            console.log(data)
            this.regerror = data.message
            console.error(data.message)
    }

}
}
}