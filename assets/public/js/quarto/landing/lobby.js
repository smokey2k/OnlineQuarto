import { socket,display,initChat,outputMessage } from '/js/quarto/widgets/chat.js'
import { updateGameList,gameListDOM } from '/js/quarto/widgets/gamelist.js'

$( document ).ready( INIT() );

function INIT() {
    
    initChat();

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

    socket.emit(`joinToRoom`);
    socket.on(`joinedToRoom`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,display);    
        }
    });
    socket.on('message', (msg)=>{
        outputMessage(msg,display);
    })

    socket.on(`updateLobby`, (games)=>{
        updateGameList(games,gameListDOM,socket);
    });

    socket.on('gameCreated', (games,game)=>{
        updateGameList(games,gameListDOM,socket);
    })
}

