const express = require('express')
const server = express()
// ta emot json i request body
server.use(express.json())

// middleware (exempel på hur detta med "use" fungerar, som i server.use)
server.use((request, response, next)=>{
    request.hello = "world"
    response.header('X-goodbye', 'cruel world')
    next()
})

// lägg till session-hantering
session = require('express-session')
server.use(session({
    secret: '.l,rtkdyfhgs.xdsdalkrdfgkcdhmsrfkx', // för att salta våra session ids
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // vi SKA använda secure cookies i produktion, MEN INTE i dev
}))

// starta servern
server.listen(3000, ()=>{
    console.log('server started at http://localhost:3000/data')
})


// data
const mongoose = require('mongoose');

// mongoose models
const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({
    name: String,
    price: Number
}))

const Menu = mongoose.model('Menu', new mongoose.Schema({
    name: String,
    menuitems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]
}))

const Customer = mongoose.model('Customer', new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true, required: true},
    password: String
}))


// rest api
const RestCustomer = require('./rest-api/customer.js')
const RestAuthentication = require('./rest-api/authentication.js')
const RestMenu = require('./rest-api/menu.js')
const RestMenuItems = require('./rest-api/menuitems.js')


async function start(){
    await mongoose.connect('mongodb+srv://foodcourt-mongodb:De9kXmzVoNuob9ZZ@cluster0.gfzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
    // add REST api
    RestCustomer(server, Customer)   
    RestAuthentication(server, Customer)
    RestMenu(server, Menu)
    RestMenuItems(server, MenuItem)
    
}
start()

