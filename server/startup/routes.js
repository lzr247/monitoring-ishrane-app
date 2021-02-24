const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const foods = require('../routes/foods');
const todaysIntakes = require('../routes/todaysIntakes');
const foodPerDayRoute = require('../routes/foodPerDayRoute');
const progressRoute = require('../routes/progressRoute');
const error = require('../middleware/error');
const cors = require('cors');

module.exports = function(app) {
    app.use(express.json());
    app.use(cors());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/food', foods);
    app.use('/api/todaysIntakes', todaysIntakes);
    app.use('/api/foodPerDay', foodPerDayRoute);
    app.use('/api/progress', progressRoute);
    app.use(error);
}
