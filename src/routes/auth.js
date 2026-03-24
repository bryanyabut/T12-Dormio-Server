const express = require('express');
const router = express.Router();
const { registerRules, loginRules } = require('../validators/authValidator'); 
const validate = require('../middleware/validate');
const { login, register } = require('../controllers/auth');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

module.exports = router;
