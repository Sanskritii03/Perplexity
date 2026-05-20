import { log } from "console";
import {Server} from "socket.io"

let io;

export function initSocket(httpServer){

    io = new Server(httpServer, {
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    })
console.log('socketio is runnningg')

    io.on("connection",(socket)=>{
        console.log("user connected:" + socket.id);
        
    })
}

export function getIO(){
    if(!io){
        throw new error ("socket.io not intialize")
    }

    return io
}