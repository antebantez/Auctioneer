// Registration

module.exports = function(server, Customer){

    server.post('/data/customer', async (request, response) => {
        let item = new Customer(request.body)
        let result = await item.save()
        response.json(result)
    })

}