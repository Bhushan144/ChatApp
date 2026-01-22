import { Server } from "socket.io";
import {createServer} from 'node:http'
import express from 'express'

const app = express();
const server = createServer(app); //created the http server of node

const io = new Server(server,{
    cors:{
        origin:'*'
    }
});


io.on("connection",(socket)=>{
    // console.log("a user connected ",socket.id);

    socket.on("joinRoom",async (userName)=>{
        // console.log(`${userName} is joining the room.`);

        await socket.join("room1"); //join a room1

        //send to all
        // io.to("room1").emit("roomNotice",userName);

        //send to all , except self
        socket.to("room1").emit("roomNotice",userName)
    })

    //receive the message from user and send to other users in room
    socket.on("chatMessage",(messageData)=>{
        socket.to("room1").emit("chatMessage",messageData);
    })


    socket.on("typing",(userName)=>{
        socket.to("room1").emit("typing",userName);
    })

    socket.on("stopTyping",(userName)=>{
        socket.to("room1").emit("stopTyping",userName);
    })
})


app.get('/',(req,res)=>{
    res.send("hello world");
})


const PORT = process.env.PORT || 4600;
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});
