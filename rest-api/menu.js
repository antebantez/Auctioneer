module.exports = function(server, Menu){

    // GET (read, select) all
    server.get('/data/menu', async (request, response) => {
        let result = await Menu.find()
        response.json(result)
    })

    // GET (read, select) one item
    // http://localhost:3000/data/menu/62306aab6d2c577222972441

    server.get('/data/menu/:id', async (request, response) => {
        let item = await Menu.findById(request.params.id).populate('menuitems').exec()
        response.json(item)
    })


    // POST (create, insert)
    server.post('/data/menu', async (request, response) => {
        let item = new Menu(request.body)
        let result = await item.save()
        response.json(result)
    })

    // PUT (update, update)
    server.put('/data/menu/:id', async (request, response) => {
        let item = await Menu.findById(request.params.id)
        Object.assign(item, request.body)
        let result = await item.save()
        response.json(result)
    })


    // DELETE (delete, delete)
    server.delete('/data/menu/:id', async (request, response) => {

    })
}