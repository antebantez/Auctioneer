
module.exports = function(server, MenuItem){

    // GET (read, select) all
    server.get('/data/menu-items', async (request, response) => {
        let result = await MenuItem.find()
        response.json(result)
    })

    // GET (read, select) one item
    // http://localhost:3000/data/menu-items/2
    server.get('/data/menu-items/:id', async (request, response) => {
        let result = await MenuItem.findById(request.params.id)
        response.json(result)
    })


    // POST (create, insert)
    server.post('/data/menu-items', async (request, response) => {
        let item = new MenuItem(request.body)
        let result = await item.save()
        response.json(result)
    })

    // PUT (update, update)
    server.put('/data/menu-items/:id', async (request, response) => {
        let item = await MenuItem.findById(request.params.id)
        Object.assign(item, request.body)
        let result = await item.save()
        response.json(result)
    })


    // DELETE (delete, delete)
    server.delete('/data/menu-items/:id', async (request, response) => {

    })

}