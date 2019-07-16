const express = require('express');

const router = express.Router();

const auth = require('../utils/auth');

const startSession = require('../controllers/auth/authentication.controller');
const getAccountBalance = require('../controllers/account/get.balance.controller');
const accountWithdrawal = require('../controllers/account/withdrawal.controller');


router.get(
    '/',
    (req, res) => {
        res.status(200).json({
            message: 'ATM Service'
        });
    },
);


router.post('/',
    startSession
);


router
    .get('/balance',
    auth.extractUser,
    getAccountBalance
);


router
    .post('/withdrawal',
    auth.extractUser,
    accountWithdrawal
);


router
    .get('/end-session',
    (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/');
        });
    }
);

module.exports = router;
