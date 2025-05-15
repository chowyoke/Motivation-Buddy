// Needed for dotenv
require("dotenv").config();

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
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// Main landing page
app.get('/', async function(req, res) {
    res.render('index', { msg : "", color: "" });
});

// Create a new post
app.post('/subscribe', async function(req, res) {
    try {
        console.log("Received POST /subscribe");
        console.log(req.body); // Add this line

        const { name, phone, start_date, message_times } = req.body;

        if (!name || !phone || !start_date || !message_times || message_times.length === 0) {
            res.render('index', { msg : "Please fill out all fields.", color: "#d9534f" });
        } else {
            await prisma.post.create({
                data: { name, phone, start_date, message_times: Array.isArray(message_times) ? JSON.stringify(message_times) : JSON.stringify([message_times])
    },
            });
            res.render('index', { msg : "Subscription has been added successfully!", color: "green" });
          

    //               validationMsg.style.color = 'green';
    //   validationMsg.textContent = 'Subscription successful!';
        }
    } catch (error) {
        console.log(error);
        res.render('index', { msg : error , color: "#d9534f" });
    }
});


// Tells the app which port to run on
app.listen(8080);