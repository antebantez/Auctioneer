module.exports = function (server, db) {
  // GET (read, select) all
  server.get("/data/products", async (request, response) => {
    let query = "SELECT * FROM products";
    let result = await db.all(query);
    response.json(result);
  });

  // GET (read, select) one item
  server.get("/data/menu-items/:id", async (request, response) => {
    // request.params.id === 2

    let query = "SELECT * FROM menuitems WHERE id = ?";
    let result = await db.all(query, [request.params.id]);
    response.json(result);
  });

  // POST (create, insert)
  server.post("/data/menu-items", async (request, response) => {
    let query = "INSERT INTO menuitems (name, price) VALUES(?,?)";
    await db.run(query, [request.body.name, request.body.price]);
    response.json({ result: "One row created" });
  });

  // PUT (update, update)
  server.put("/data/menu-items/:id", async (request, response) => {
    let query = "UPDATE menuitems SET name = ?, price = ? WHERE id = ?";
    await db.run(query, [
      request.body.name,
      request.body.price,
      request.params.id,
    ]);
    response.json({ result: "One row updated" });
  });

  // DELETE (delete, delete)
  server.delete("/data/menu-items/:id", async (request, response) => {
    let query = "DELETE FROM menuitems WHERE id = ?";
    await db.run(query, [request.params.id]);
    response.json({ result: "One row delete" });
  });

  server.post("/data/login", async (request, response) => {
    let query = "SELECT * FROM customers WHERE email = ? AND password = ?";
    let result = await db.all(query, [
      request.body.email,
      request.body.password,
    ]);
    if (result.length > 0) {
      request.session.customer = result[0];
      response.json({ loggedIn: true });
    } else {
      delete request.session.customer;
      response.json({ loggedIn: false });
    }
  });

  server.get("/data/login", async (request, response) => {
    if (request.session.customer) {
      let query = "SELECT * FROM customers WHERE email = ? AND password = ?";
      let result = await db.all(query, [
        request.session.customer.email,
        request.session.customer.password,
      ]);

      if (result.length > 0) {
        response.json({
          firstname: request.session.customer.firstname,
          lastname: request.session.customer.lastname,
          email: request.session.customer.email,
        });
      } else {
        response.json({ loggedIn: false });
      }
    } else {
      response.json({ loggedIn: false });
    }
  });

  server.delete("/data/login", async (request, response) => {
    delete request.session.customer;
    response.json({ loggedIn: false });
  });
}