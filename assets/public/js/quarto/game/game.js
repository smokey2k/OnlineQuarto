import { socket,display,initChat,outputMessage } from '../widgets/chat.js'
$( document ).ready( INIT() );

function INIT() {
    initChat();
    socket.emit(`joinToGame`);
    socket.on(`joinedToGame`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,display);    
        }
    });
    socket.on('message', (msg)=>{
        outputMessage(msg,display);
    })
}
