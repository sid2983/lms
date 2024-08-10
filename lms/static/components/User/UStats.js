export default {
    template: `
    <div>
        <h2>Stats</h2>
        <div class="row">
            <div class="col-md-4" v-for="book in books" :key="book.id">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title
                        ">{{ book.title }}</h5>
                        <p class="card-text">{{ book.author }}</p>
                        <p class="card-text">{{ book.isbn }}</p>
                        <p class="card-text">{{ book.section }}</p>
                        <p class="card-text">{{ book.copies }}</p>
                        
                    </div>

                </div>
            </div>

        </div>

    </div>

    `,

}