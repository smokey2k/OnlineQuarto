import { socket,chat_display,initChat,outputMessage } from '/js/quarto/widgets/chat.js'
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
    socket.on("connect", () => {
        //const userDisplay = document.querySelector('#socket');
        //userDisplay.innerHTML = socket.id;
      });
    socket.on("disconnect", () => {
        console.log(socket.id); // undefined
      });

    socket.on(`joinedToRoom`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,chat_display);    
        }
    });

    socket.on('gameCreated', (gamesList)=>{
        updateGameList(gamesList,gameListDOM,socket);
    });


}




