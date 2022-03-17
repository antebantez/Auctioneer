//sql data
const util = require("util");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database/auctioneer.db");
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, unique: true, required: true },
    password: String,
  })
);
