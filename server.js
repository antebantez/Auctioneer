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

//1 Som besökare vill jag kunna se sammanfattade auktionsobjekt som en lista.
//4 Som besökare vill jag kunna se nuvarande bud på auktionsobjekt i listvyer
server.get("/data/products", async (request, response) => {
  let query = `SELECT products.name, products.image, bids.highestBid
FROM auctions
JOIN  products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id;`;
  let result = await db.all(query);
  response.json(result);
});

//2 Som besökare vill jag kunna se detaljer för varje auktionsobjekt
//5 Som besökare vill jag kunna se nuvarande bud på auktionsobjekt i detaljsidor.
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
});

//3 Som besökare vill jag kunna söka på auktioner baserat på vad jag skriver i ett sökfält.
server.get("/data/search/:keyword", async (request, response) => {
  let query = `SELECT products.name, bids.highestBid, products.image
FROM auctions
JOIN products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id

WHERE products.name like(?);`;
  let result = await db.all(query, ["%" + request.params.keyword + "%"]);
  response.json(result);
});

//14 Som besökare vill jag kunna se auktioner inom kategorier.
server.get("/data/search/categories/:category", async (request, response) => {
  let query = `SELECT products.name, bids.highestBid, products.image
FROM auctions
JOIN products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id
JOIN categories ON products.category = categories.id
WHERE categories.categoryName LIKE(?)`;
  let result = await db.all(query, ["%" + request.params.category + "%"]);
  response.json(result);
});
//15 Som besökare vill jag kunna söka på auktioner inom en kategori jag valt.
server.get(
  "/data/search/categories/:category/:product",
  async (request, response) => {
    let query = `SELECT products.name, bids.highestBid, products.image
FROM auctions
JOIN products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id
JOIN categories ON products.category = categories.id
WHERE categories.categoryName LIKE(?) AND products.name LIKE(?)`;
    let result = await db.all(query, [
      "%" + request.params.category + "%",
      "%" + request.params.product + "%",
    ]);
    response.json(result);
  }
);

//6 Som besökare vill jag kunna registrera ett nytt konto och bli användare.
server.post("/data/user", async (request, response) => {
  let query = `INSERT INTO users (name, email, password)
VALUES (?,?,?)`;
  await db.run(query, [
    request.body.name,
    request.body.email,
    request.body.password,
  ]);
  response.json({ result: "Your account has been created" });
});

//7 Som användare vill jag kunna logga in
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
//7 Kolla om man är inloggad på hemsidan
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

// 7 Logga ut från hemsidan
server.delete("/data/login", async (request, response) => {
  delete request.session.customer;
  response.json({ loggedIn: false });
});

// 8 Som användare vill jag kunna lägga (högre än nuvarande) bud på auktionsobjekt på dess detaljsida.
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

//Lägga till
//9 Som användare vill jag kunna skapa nya auktionsobjekt.
//11 Som användare vill jag att auktionsobjekt ska innehålla minst titel, beskrivning, starttid, sluttid och bild(er)
//12 Som användare vill jag kunna sätta ett utgångspris på mina auktionsobjekt.
//13 Som användare vill jag kunna sätta ett dolt reservationspris på mina auktionsobjekt. (om bud ej uppnått reservationspris när auktionen avslutas så säljs objektet inte).
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
    response.json({ result: "Your auction has been created" });
  } else {
    response.json({ result: "Failed to create auction!" });
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

//17 Som användare vill jag kunna se en lista med mina egna auktionsobjekt.
server.get("/data/my-auctions", async (request, response) => {
  let query = `SELECT products.name, products.image, bids.highestBid
FROM auctions
JOIN  products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id
WHERE auctions.auctionHolder = ?`;
  let result = await db.all(query, [request.session.customer.id]);
  response.json(result);
});

//18 Som användare vill jag kunna se en lista med auktionsobjekt jag har lagt bud på.
server.get("/data/my-bids", async (request, response) => {
  let query = `SELECT products.name, products.image, bids.highestBid
FROM auctions
JOIN  products ON auctions.product = products.id
JOIN bids ON bids.auctionId = auctions.id
WHERE bids.bidder = ?`;
  let result = await db.all(query, [request.session.customer.id]);
  response.json(result);
});

//20 Som användare vill jag ha en publik profilsida där namn, publika kontaktuppgift(er) & bild visas för andra att läsa.
server.get("/data/profiles/:id", async (request, response) => {
  let query = `SELECT name, phoneNumber, email, picture
FROM users
WHERE id = ?`;
  let result = await db.all(query, [request.params.id]);
  response.json(result);
});
