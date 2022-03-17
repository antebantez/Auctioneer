// Authentication

module.exports = function(server, Customer){

    server.post('/data/login', async (request, response) => {
        let result = await Customer.findOne({
            email: request.body.email,
            password: request.body.password
        })            
        if (result) {
            request.session.customer = result
            response.json({ loggedIn: true })
        } else {
            delete (request.session.customer)
            response.json({ loggedIn: false })
        }
    })

    server.get('/data/login', async (request, response) => {
        if (request.session.customer) {
            let result = await Customer.findOne({
                email: request.session.customer.email,
                password: request.session.customer.password
            }) 
            if (result) {
                response.json({
                    firstname: request.session.customer.firstname,
                    lastname: request.session.customer.lastname,
                    email: request.session.customer.email
                })

            } else {
                response.json({ loggedIn: false })
            }

        } else {
            response.json({ loggedIn: false })
        }
    })


    server.delete('/data/login', async (request, response) => {
        delete (request.session.customer)
        response.json({ loggedIn: false })
    })

}