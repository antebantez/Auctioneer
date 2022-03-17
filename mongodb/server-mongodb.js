const mongoose = require("mongoose");

// mongoose models
const MenuItem = mongoose.model(
  "MenuItem",
  new mongoose.Schema({
    name: String,
    price: Number,
  })
);

const Menu = mongoose.model(
  "Menu",
  new mongoose.Schema({
    name: String,
    menuitems: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
  })
);

// rest api
const RestCustomer = require("./rest-api/customer.js");
const RestAuthentication = require("./rest-api/authentication.js");
const RestMenu = require("./rest-api/menu.js");
const RestMenuItems = require("./rest-api/menuitems.js");

async function start() {
  await mongoose.connect(
    "mongodb+srv://auctioneer:HaNYxwm5bLEhisow@actioneer.teqmr.mongodb.net/auctioneerdb?retryWrites=true&w=majority"
  );
  // add REST api
  RestCustomer(server, Customer);
  RestAuthentication(server, Customer);
  RestMenu(server, Menu);
  RestMenuItems(server, MenuItem);
}
start();
