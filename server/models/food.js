const Joi = require('joi');
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    image:{
        type: String, 
        required: true
    },
    name:{
        type: String,
        required: true
    },
    weight:{
        type: Number,
        required: true
    },
    energy:{
        type: Number,
        required: true
    },
    energyUnit:{
        type: String,
        required: true
    },
    proteins:{
        type: Number,
        required: true
    },
    carbs:{
        type: Number,
        required: true
    },
    fat:{
        type: Number,
        required: true
    },
    weightUnit:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    }
}, { collection : 'food' });

const Food = mongoose.model('Food', foodSchema);

function validateFood(food){
    const schema = Joi.object({
        image: Joi.string().required(),
        name: Joi.string().required(),
        weight: Joi.number().required(),
        energy: Joi.number().required(),
        energyUnit: Joi.string().required(),
        proteins: Joi.number().required(),
        carbs: Joi.number().required(),
        fat: Joi.number().required(),
        weightUnit: Joi.string().required(),
        category: Joi.string().required()
    });
    return schema.validate(food);
}

exports.Food = Food;
exports.validateFood = validateFood;
exports.foodSchema = foodSchema;
