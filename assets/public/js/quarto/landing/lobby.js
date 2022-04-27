import { socket,chat_display,initChat,outputMessage } from '/js/quarto/widgets/chat.js'
import { updateGameList,gameListDOM } from '/js/quarto/widgets/gamelist.js'

// wait till page fully loaded
$( document ).ready( INIT() );

function INIT() {
    // initialise the chat window
    initChat();

    // ajax submit 
    $(".create-game-form").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/game",
            type: "POST",
            data: {'gameroom': `${userInfo.userID}-${userInfo.name}`},
            success: function(data){
                socket.emit('createGame');
                location.href = '/game';
            }
        });
    });

    // message to server a clint want to join to the room
    socket.emit(`joinToRoom`);
    
    // message from the server if a user joined to the room
    socket.on(`joinedToRoom`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,chat_display);    
        }
    });

    // message to server if someone creates a game
    socket.on('gameCreated', (gamesList)=>{
        updateGameList(gamesList,gameListDOM,socket);        
    });

}
