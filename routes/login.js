const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('../passport-config');
const users = require('../models/users');

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id ===id)
)

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

router.get('/login', (req, res, next) => {
    res.render('login', {title: "Login"})
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


module.exports = router;