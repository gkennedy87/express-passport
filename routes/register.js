const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require('../models/users');

router.get('/register', (req, res, next) => {
    res.render('register', {title: "Register", name: "Grant"})
});

router.post('/register', async(req, res) => {
    // use Try catch because of async method,
    // then pass the password from the request body into bcrypt for hashing
    try {
        const hashedPass = await bcrypt.hash(req.body.password,10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
        res.redirect('/login')
    } catch {
        res.redirection('/register')
    }
    console.log(users)
})

module.exports = router;