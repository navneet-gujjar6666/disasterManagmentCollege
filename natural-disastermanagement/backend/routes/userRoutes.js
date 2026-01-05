const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlware/auth');
const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.login);
// Optional admin bootstrap endpoint
router.post('/register-admin', userController.createAdmin);

router.use(auth);
router.get('/profile', userController.profile);

module.exports = router;