const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const authorizedUser = require('../middleware/authorized-user');
const UserControler = require('../controlers/users');

router.post('/signup', UserControler.signup);

router.post('/login', UserControler.login);

router.get('/:userId', checkAuth, authorizedUser, UserControler.getUser);

router.get('/', UserControler.getAllUsers);

router.delete('/:userId', UserControler.deleteUser);

module.exports = router;
