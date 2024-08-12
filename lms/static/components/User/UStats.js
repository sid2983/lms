export default {
    template: `
    <div class="container">
        <span> Download Books CSV from here : </span> <button class="btn btn-outline-primary" @click="downloadBook"> Download Resource </button>
        <span v-if="isWaiting"> Waiting .... </span>
        

    </div>

    `,
    data(){
        return {
            isWaiting :false,
        }
    },

    methods:{
        async downloadBook(){
            this.isWaiting = true;
            const res = await fetch('/download-csv')
            const data = await res.json()
            if(res.ok){
                const taskId = data['task-id']
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if(csv_res.ok){
                        this.isWaiting = false
                        clearInterval(intv)
                        window.location.href = `/get-csv/${taskId}`
                    }
                })
            }
        },
    },

}