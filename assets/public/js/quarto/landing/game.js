import { socket,chat_display,initChat,outputMessage,displayChatHistory } from '/js/quarto/widgets/chat.js'

let currentPlayer;
let game = false;
let userindex;
let waiting = setInterval(()=>{waitingForPlayes2()}, 500);


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






function addNextArrow(){
    if (currentPlayer == 2)
    {
        document.getElementById('ply1').classList.remove('arrow');
        document.getElementById('ply2').classList.add('arrow');
    }
    else
    {
        document.getElementById('ply2').classList.remove('arrow');
        document.getElementById('ply1').classList.add('arrow');
    }
}

function setPos(id){
     if (currentPlayer == userindex)
    {
        socket.emit('putCell', id); 
    }    
    else
    {
        alert('A másik játékos jön!');
    }
}

function waitingForPlayes2()
{
    let str = document.querySelector('#plyr2').innerHTML;
    if (str == '') {
        str = 'Waiting for another player';
    }
    if (str.length < 29)
    {
        str += '.';
    }
    else
    {
        str = str.substring(0, 26);
    }
    document.querySelector('#plyr2').innerHTML = str;
}



const socket = io();

socket.emit('joinToGame');

socket.on('UserIndex', (index)=>{
    userindex = index;
})


// ha a másik játékos is csatlakozott
socket.on('playerConnected', (users, rnd)=>{

    document.querySelector('#plyr1').innerHTML = users[0].username;
    if (users.length >1)
    {
        document.querySelector('#plyr2').innerHTML = users[1].username;
        clearInterval(waiting);
        currentPlayer = rnd;
        game = true;
        addNextArrow();
    }
})

socket.on('drawCell', (id, userNr)=>{
    let currentCell = document.getElementById('cell'+id);
  //  let ball = document.createElement('div');
    //currentCell.appendChild(ball);
   // ball.classList.add('takenP'+userNr);
   currentCell.classList.add('takeP'+userNr);
   if (userNr == 1)
   {
       userNr = 2;
   }
   else
   {
       userNr = 1;
   }
   currentPlayer = userNr;
   addNextArrow();
});

socket.on('win', (winner)=>{
    window.alert(winner + ' nyert!');
    game = false;
});