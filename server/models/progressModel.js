const Joi = require('joi');
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
}, { collection : 'progresses' });

const Progress = mongoose.model('Progress', progressSchema);

function validateProgress(progress){
    const schema = Joi.object({
        email: Joi.string().required(),
        date: Joi.string().required(),
        weight: Joi.number().required()
    });
    return schema.validate(progress);
}

exports.Progress = Progress;
exports.validate = validateProgress;
exports.progressSchema = progressSchema;