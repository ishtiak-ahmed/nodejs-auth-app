const express = require('express');
const router = express.Router();
const userController = require('../user/user.controller');

router.get('/ping', (req, res) => res.send('Server is running'));
router.post('/register', userController.register);
router.post('/login', userController.login);
router.delete('/logout', userController.logout);
router.get('/refresh', userController.refreshToken);

router.get('/me', userController.isAuthenticated, userController.getCurrentUser);
module.exports = router;
