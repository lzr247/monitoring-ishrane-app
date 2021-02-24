const {Food} = require('../models/food');
const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/authUser');

router.get('/', auth, async (req, res) => {
    const foods = await Food.find();
    res.send(foods);
});

module.exports = router;