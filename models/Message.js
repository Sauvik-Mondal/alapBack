const Joi = require('joi');
const mongoose = require('mongoose');

//Make a Schema
const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    time: {
        type: Date,
        required: true,
        min: 0
    },
    sender: {
        type: String,
        required: true
    }
});

//Use Schema to make a class
const Message = new mongoose.model('Message', MessageSchema);

//validate the data send against the schema
function validateMessage(message) {
    const schema = Joi.object({
        text: Joi.string().min(1).max(500).required(),
        time: Joi.date().min(0).required(),
        sender: Joi.string().required()
    });
    return schema.validate(message);
}

//export class and func 
module.exports.Message = Message;
module.exports.validateMessage = validateMessage;