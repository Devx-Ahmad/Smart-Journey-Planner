require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 5500;

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Static Fields 
app.use(express.static('public'));

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

// Setup flash
app.use(flash({ sessionKeyName: 'express-flash-message' }));

// Templating Engine   
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = isAuthenticated;

// Routes
app.use('/', require('./server/routes/routes'));

// Handle 404
app.get('*', (req, res) => {
    res.render('404');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

