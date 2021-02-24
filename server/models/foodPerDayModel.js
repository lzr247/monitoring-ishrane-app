const Joi = require('joi');
const mongoose = require('mongoose');
const {foodSchema} = require('./food.js');

const foodPerDaySchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    meal:{
        type: String,
        required: true
    },
    date:{
        type: String
    },
    foodList:{
        type: [foodSchema]
    }
}, { collection : 'foodperdays' });

const FoodPerDay = mongoose.model('FoodPerDay', foodPerDaySchema);

function validateFoodPerDay(foodPerDay){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        meal: Joi.string().required()
    });
    return schema.validate(foodPerDay);
}

exports.FoodPerDay = FoodPerDay;
exports.validate = validateFoodPerDay;