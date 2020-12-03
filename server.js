if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const hbs = require('express-handlebars');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
const users = require('./models/users');
initializePassport(passport, email => {
    return users.find(user => user.email === email)
})
// Initialize app
const app = express();


// Configure View Engine
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

// Enable routes to use Req object
app.use(express.urlencoded({ extended:false}))

// Configure Flash and sessions
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
// Configure public dir
app.use(express.static(__dirname + '/public'));

// Configure Routes
app.get('/', checkAuthenticated, indexRouter);
app.get('/login', checkNotAuthenticated, loginRouter);
app.post('/login', checkNotAuthenticated, loginRouter);
app.get('/register', checkNotAuthenticated, registerRouter);
app.post('/register', checkNotAuthenticated, registerRouter);
app.delete('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});
// Authentication middlware

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login')
    }
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        next();
    }
}

app.listen(3000);