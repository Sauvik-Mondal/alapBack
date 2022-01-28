const Joi = require('joi');
const mongoose = require('mongoose');

const { Message } = require('./Message')

//Make a Schema
const RoomSchema = new mongoose.Schema({
    profilePic: {
        type:String
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 500
    },
    noOfMembers: {
        type: Number,
        required: true,
        min: 1
    },
    private:{
        type: Boolean,
        required: true
    },
    members: [{
        name:{
            type: String,
            required: true
        }
    }],
    messages: [
        {
            text: {
                type: String,
                required: true,
                minlength: 1,
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
        }
    ]
});

//Use Schema to make a class
const Room = new mongoose.model('Room', RoomSchema);

//validate the data send against the schema
function validateRoom(room) {
    const schema = Joi.object({
        profilePic: Joi.string(),
        name: Joi.string().min(2).max(500).required(),
        noOfMembers: Joi.number().min(1).required(),
        private: Joi.boolean().required(),
        members:Joi.array(),
        messages:Joi.array()
    });
    return schema.validate(room);
}

//export class and func 
module.exports.Room = Room;
module.exports.validateRoom = validateRoom;