// Needed for dotenv
require("dotenv").config();

// To run telegram bot
require('./telegram');

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const prisma = require('./prisma');

// Main landing page
app.get('/', async function(req, res) {
    res.render('index', { msg : "", color: "", signup_code: null });
});

// Function to generate a random code:
function generateSignupCode(length = 6) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

// Create a new post
app.post('/subscribe', async function(req, res) {
    try {
        console.log("Received POST /subscribe");
        console.log(req.body); 

        const { name, interests, message_times } = req.body;

        if (!name || !message_times || message_times.length === 0) {
            // If AJAX, send JSON error
            if (req.headers['content-type'] === 'application/json') {
                return res.status(400).json({ msg: "Please fill out all fields.", color: "#d9534f" });
            }
            // Else, render EJS
            return res.render('index', { msg : "Please fill out all fields.", color: "#d9534f", signup_code: null });
        } else {
            const signup_code = generateSignupCode(6);
            await prisma.post.create({
                data: { name, interests: Array.isArray(interests) ? interests : [], message_times: Array.isArray(message_times) ? message_times : [message_times], signup_code }
                });
            // If AJAX, send JSON with code
            if (req.headers['content-type'] === 'application/json') {
                return res.json({
                    msg: "Subscription has been added successfully! Please copy your unique code below, then click the Telegram bot link and send this code to the bot to complete your registration.",
                    color: "green",
                    signup_code
                });
            }
            // Else, render EJS
            return res.render('index', {msg : "Subscription has been added successfully! Please copy your unique code below, then click the Telegram bot link and send this code to the bot to complete your registration.", color: "green",
  signup_code });
          // pass signup_code to the EJS template after successful signup.

        }
    } catch (error) {
        console.log(error);
        if (req.headers['content-type'] === 'application/json') {
            return res.status(500).json({ msg: error.toString(), color: "#d9534f" });
        }
        return res.render('index', { msg : error , color: "#d9534f", signup_code: null });
    }
});


// Tells the app which port to run on
app.listen(8080);