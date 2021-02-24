const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('config');

const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true,
        maxlength: 15
    },
    surname:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    gender:{
        type: String,
        required: true
    },
    birthYear:{
        type: Number,
        min:1900,
        max: new Date().getFullYear(),
        required: true
    },
    height:{
        type: Number,
        required: true,
        min: 120,
        max: 250
    },
    weight:{
        type: Number,
        required: true,
        min: 30,
        max: 250
    },
    goal:{
        type: String,
        required: true
    },
    lostGainKg:{
        type: Number,
        required: true,
        min: 0,
        max: 50
    },
    dietPlan:{
        type: String,
        required: true
    },
    dietDescription:{
        type: String,
        required: true
    },
    maxIntakeCals:{
        type: Number,
        required: true,
        min: 0
    },
    maxIntakeProteins:{
        type: Number,
        required: true,
        min: 0
    },
    maxIntakeFats:{
        type: String,
        required: true,
        min: 0
    },
    maxIntakeCarbs:{
        type: Number,
        required: true,
        min: 0
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id, email: this.email }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().max(15).required(),
        surname: Joi.string().min(2).max(15).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        gender: Joi.string().required(),
        birthYear: Joi.number().min(1900).max(new Date().getFullYear()).required(),
        height: Joi.number().min(120).max(250).required(),
        weight: Joi.number().min(30).max(250).required(),
        goal: Joi.string().required(),
        lostGainKg: Joi.number().min(0).max(50).required(),
        dietPlan: Joi.string().required(),
    });
    return schema.validate(user);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;