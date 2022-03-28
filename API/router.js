const express = require('express');
const router = express.Router();
const auth = require('./control/auth.js');
const landing = require('./control/landing.js');

const redirectLogin = (req,res, next) => {
    if (!req.session.userID) {
        res.redirect('/login')
    } else {
        next();
    }
}

const redirectLanding = (req,res, next) => {
    if (req.session.userID) {
        res.redirect('/landing')
    } else {
        next();
    }
}

router.get('/', auth.GET_root);
router.get('/login',redirectLanding, auth.GET_login);
router.post('/login',redirectLanding, auth.POST_login);
router.get('/register', auth.GET_register);
router.post('/register', redirectLanding, auth.POST_register);
router.post('/logout', redirectLogin, auth.POST_logout);

router.get('/landing', redirectLogin, landing.GET_landing);

module.exports = router;
