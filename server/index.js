const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const {addUser,getUser,removeUser,getUsersInRoom} = require('./users');
const serverless = require('serverless-http');
const router=express.Router();
const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors:{
        origin : "*"
    }
});

app.use(cors());
router.get('/',(req,res)=>{
    res.send("Server is up and running ");
});

router.get('/json',(req,res)=>{
    res.send("Oooo Papi");
})

app.use('/',router);

io.on('connection', (socket)=>{
    console.log("We have  a new connection !!!");
    socket.on('join',({name,room},callback)=>{
        const {error,user} = addUser({id:socket.id,name,room});
        if(error){
            return callback(error);
        }
        socket.emit('message',{user:'admin',text:`${user.name}, Welcome to the room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined`});
        socket.join(user.room);
        
        io.to(user.room).emit('roomData',{room:user.room , users:getUsersInRoom(user.room)});
        callback();
    })
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id);
        console.log(user);
        io.to(user.room).emit('message',{user:user.name,text:message});
        io.to(user.room).emit('roomData',{room:user.room,text:message});
        callback();
    });
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the chat!`});
        }
    })
})

server.listen(process.env.PORT || 9000, () => console.log(`Server has started`));
module.exports.handler = serverless(app);