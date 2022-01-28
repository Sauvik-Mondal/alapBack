const Express = require("express");
const app = Express();
const mongoose = require('mongoose');

const { Message, validateMessage } = require('./models/Message')
const { Room, validateRoom } = require('./models/Room')
let io=null;
//middlewares
app.use(Express.json());

mongoose.connect('mongodb://localhost/alap')
.then(() => console.log('connected'))
.catch(() => console.log('error in connection'));

//done add message to the room
app.post("/api/message/:name",async(req,res) => {
    
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).send({'message':error.details[0].message});

    const data = {
        text: req.body.text,
        time: req.body.time,
        sender: req.body.sender
    };
    const targetMessages = await Room.findOne({"name":req.params.name})
    targetMessages.messages.push(data);
    targetMessages.save();
    io.emit('connection', data)
    res.send(data);
})

//done add user to the room
app.post("/api/addUser/:userName/:roomName",async(req,res) => {
    
    const target = await Room.findOne({"name":req.params.roomName})
    target.members.push({name:req.params.userName});
    target.save();
    io.emit('addMember', {name:req.params.userName});
    res.send({name:req.params.userName});
})

//done delete message from the room
app.delete("/api/message/:roomName/:id",async(req,res) => {

    const targetRoom = await Room.findOne({"name":req.params.roomName})
    const targetMessage = targetRoom.messages.id(req.params.id);
    targetMessage.remove();
    targetRoom.save();
    res.send(targetMessage);
})

//done get room details by roomName
app.get("/api/room/:RoomName",(req,res) => {
    Room
        .find({"name":req.params.RoomName})
        .select(['profilePic' , 'name', 'noOfMembers', '_id', 'private', 'members' , 'messages'])
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
        .catch((err) => {
            console.log('err in saving' + err.message);
            res.status(500).send({'message':'error in fetching data' + err.message});
        });
})

//done used search rooms with username
app.get("/api/user/:userName",(req,res) => {
    Room.find({"members.name":req.params.userName})
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
        .catch((err) => {
            console.log('err in saving' + err.message);
            res.status(500).send({'message':'error in fetching data' + err.message});
        });
})

//done create a room with details
app.post("/api/createRoom/",(req,res) => {
    
    const { error } = validateRoom(req.body);
    if (error) return res.status(400).send({'message':error.details[0].message});

    //use class to make objects
    let room = new Room({
        profilePic: req.body.profilePic,
        name: req.body.name,
        noOfMembers: req.body.noOfMembers,
        private: req.body.private,
        members: req.body.members,
        messages: req.body.messages
    });
    room.save()
        .then((data) => {
            console.log('Saved');
            res.send(data);
        })
        .catch((err) => {
            console.log('err in saving' + err.message);
            res.status(500).send({'message':err.message})
        });

})

const server = app.listen(8080,() => { console.log("listening 8080")});
io = require("socket.io")(server);
io.on("connection", socket => console.log("socket connected")); 