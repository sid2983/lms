import GeneralUserHome from "./GeneralUserHome.js"
import LibrarianHome  from "./LibrarianHome.js"


export default {
    template: `<div> 
    <GeneralUserHome v-if="userRole =='user'"/>
    <LibrarianHome v-if="userRole =='librarian'"/>
    </div>`,

    data(){
        return{
            userRole:localStorage.getItem('user-role')
        }
    },

    components:{
        GeneralUserHome,
        LibrarianHome,
    },
}