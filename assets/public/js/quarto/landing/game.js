import { socket,chat_display,initChat,outputMessage,displayChatHistory } from '/js/quarto/widgets/chat.js'

$( document ).ready( INIT() );

function INIT() {
    initChat();

    socket.emit(`joinToGame`);
    socket.on("connect", () => {
    });
    socket.on("disconnect", () => {
    });

    socket.on(`joinedToGame`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,chat_display);    
        }
    });
}

