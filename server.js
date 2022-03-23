const express = require("express");
const server = express();
// ta emot json i request body
server.use(express.json());

// lägg till session-hantering
session = require("express-session");
server.use(
  session({
    secret: ".l,rtkdyfhgs.xdsdalkrdfgkcdhmsrfkx", // för att salta våra session ids
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // vi SKA använda secure cookies i produktion, MEN INTE i dev
  })
);

// starta servern
server.listen(3000, () => {
  console.log("server started at http://localhost:3000/data");
});

// data
const util = require("util");
const sqlite3 = require("sqlite3");
const req = require("express/lib/request");
const db = new sqlite3.Database("./SQL/database/auctioneer.db");
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

// REST API

// GET (read, select) all
//1
//4
server.get("/data/products", async (request, response) => {
  let query = `SELECT products.name, products.image, bids.highestBid
FROM auctions
JOIN  products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id;`;
  let result = await db.all(query);
  response.json(result);
});

// GET (read, select) one item
// http://localhost:3000/data/menu-items/2

//2
//5
server.get("/data/auction/:id", async (request, response) => {
  let query = `SELECT products.name, bids.highestBid, products.startPrice, products.description, products.image, users.name, categories.categoryName
FROM auctions
JOIN  products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id
JOIN users ON products.sellerId = users.id
JOIN categories ON products.category = categories.id
WHERE auctions.id = ?`;
  let result = await db.all(query, [request.params.id]);
  response.json(result);

  // response.status(404)
  // response.json({error: "Not found"})
});
//3
server.get("/data/search/:keyword", async (request, response) => {
  // request.params.id === 2

  let query = `SELECT products.name, bids.highestBid, products.image
FROM auctions
JOIN products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id

WHERE products.name like(?);`;
  let result = await db.all(query, ["%" + request.params.keyword + "%"]);
  response.json(result);

  // response.status(404)
  // response.json({error: "Not found"})
});

//6
server.post("/data/user", async (request, response) => {
  let query = `INSERT INTO users (name, email, password)
VALUES (?,?,?)`;
  await db.run(query, [
    request.body.name,
    request.body.email,
    request.body.password,
  ]);
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
//7
server.post("/data/login", async (request, response) => {
  let query = "SELECT * FROM users WHERE email = ? AND password = ?";
  let result = await db.all(query, [request.body.email, request.body.password]);
  if (result.length > 0) {
    request.session.customer = result[0];
    response.json({ loggedIn: true });
  } else {
    delete request.session.customer;
    response.json({ loggedIn: false });
  }
});
//7 kanske nån annan  kolla upp
server.get("/data/login", async (request, response) => {
  if (request.session.customer) {
    let query = "SELECT * FROM users WHERE email = ? AND password = ?";
    let result = await db.all(query, [
      request.session.customer.email,
      request.session.customer.password,
    ]);

    if (result.length > 0) {
      response.json({
        name: request.session.customer.name,
        email: request.session.customer.email,
        id: request.session.customer.id,
      });
    } else {
      response.json({ loggedIn: false });
    }
  } else {
    response.json({ loggedIn: false });
  }
});
//logga ut
server.delete("/data/login", async (request, response) => {
  delete request.session.customer;
  response.json({ loggedIn: false });
});

server.put("/data/auction/:id", async (request, response) => {
  if (request.session.customer) {
    let query = `UPDATE bids
SET highestBid =
CASE 
WHEN highestBid < ? AND NOT auctions.auctionHolder = ? THEN ?
ELSE highestBid
END
WHERE bids.auctionId = ?;`;
    await db.run(query, [
      request.body.bid,
      request.session.customer.id,
      request.body.bid,
      request.params.id,
    ]);

    let changeBidder = `UPDATE bids SET bidder = ? WHERE bids.auctionId = ?`;
    await db.run(changeBidder, [
      request.session.customer.id,
      request.params.id,
    ]);
    response.send("One row updated");
  } else {
    console.log("SEAN TAR NR 10");
  }
});

//11
//9
//12
//13
server.post("/data/auctions", async (request, response) => {
  if (request.session.customer) {
    let query = `INSERT INTO products (name, startPrice, description, image, reservationPrice, category,  startTime, endTime, sellerId)
VALUES (?,?,?,?,?,?,?,?,?)`;
    await db.run(query, [
      request.body.name,
      request.body.startPrice,
      request.body.description,
      request.body.image,
      request.body.reservationPrice,
      request.body.category,
      request.body.startTime,
      request.body.endTime,
      request.session.customer.id,
    ]);
    response.json({ result: "One row created" });
  } else {
    response.json({ result: "U done GOOF" });
  }
  let query = `INSERT INTO auctions (product, auctionHolder)
VALUES ((SELECT id FROM products WHERE id = (
    SELECT MAX(id) FROM products)), ?)`;
  await db.run(query, [request.session.customer.id]);

  let addHighestBid = `INSERT INTO bids (auctionId,highestBid)
VALUES ((SELECT id FROM auctions WHERE id = (
    SELECT MAX(id) FROM auctions)), ?)`;
  await db.run(addHighestBid, [0]);
});

//Lägga till
