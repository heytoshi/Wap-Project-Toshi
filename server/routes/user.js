const express = require('express');
const router = express.Router();

const { signIn } = require('../controller/user');

router.post('/user/login', signIn);

module.exports = router;