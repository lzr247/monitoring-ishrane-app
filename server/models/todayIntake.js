const Joi = require('joi');
const mongoose = require('mongoose');

const todayIntakeSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    todayCalsIntake:{
        type: Number,
        required: true
    },
    todayCarbsIntake:{
        type: Number, 
        required: true
    },
    todayFatsIntake:{
        type: Number,
        required: true
    },
    todayProteinsIntake:{
        type: Number,
        required: true
    }
});

const TodayIntake = mongoose.model('TodayIntake', todayIntakeSchema);

function validateTodayIntake(todayIntake){
    const schema = Joi.object({
        email: Joi.string().required(),
        date: Joi.date().required(),
        todayCalsIntake: Joi.date().required(),
        todayCarbsIntake: Joi.date().required(),
        todayFatsIntake: Joi.date().required(),
        todayProteinsIntake: Joi.date().required()
    });
    return schema.validate(todayIntake);
}

exports.TodayIntake = TodayIntake;
exports.validate = validateTodayIntake;
