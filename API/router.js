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
        res.redirect(`/${req.session.route}`);
    } else {
        next();
    }
}

router.get('/', auth.GET_root);
router.get('/login',redirectLanding, auth.GET_login);
router.post('/login', auth.POST_login); //redirectLanding
router.get('/register', auth.GET_register);
router.post('/register', auth.POST_register); // redirectLanding
router.post('/logout', redirectLogin, auth.POST_logout);
router.get('/sessionOccupied', auth.GET_sessionOccupied);

router.get('/lobby', redirectLogin, landing.GET_lobby);

module.exports = router;
