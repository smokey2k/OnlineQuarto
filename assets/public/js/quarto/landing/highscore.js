import { socket,display,initChat,outputMessage } from '../widgets/chat.js'

$( document ).ready( INIT() );

function INIT() {
    initChat();

    const userDisplay = document.querySelector('#socket');
    userDisplay.innerHTML = socket.id;

    socket.emit(`joinToRoom`);
    socket.on(`joinedToRoom`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,display);    
        }
    });
    socket.on('message', (msg)=>{
        outputMessage(msg,display);
    })
}
