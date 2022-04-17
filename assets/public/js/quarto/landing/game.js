import { socket,chat_display,initChat,outputMessage,displayChatHistory } from '/js/quarto/widgets/chat.js'

let currentPlayer;
let game = false;
let userindex;

$( document ).ready( INIT() );

function INIT() {
    initChat();

    let waiting = setInterval(()=>{waitingForPlayes2()}, 500);

    for(let i=0; i<225; i++) {
        document.querySelector(`#cell${i}`).addEventListener('click', (event)=>{
             setPos(i);
        }); 
    }

    socket.on("connect", () => {
        
    });

    socket.emit(`joinToGame`);
    
    socket.on("disconnect", () => {
    });

    socket.on(`joinedToGame`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,chat_display);    
        }
    });

    socket.on('updateGameRoom', (game)=>{
        updateGameRoom(game);
    })


    socket.on('UserIndex', (index)=>{
        userindex = index;
    })

    socket.on('drawCell', (id, userNr)=>{
        let currentCell = document.getElementById('cell'+id);
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
        displayCurrentPlayer();
     });

     socket.on('gameStarted', (rnd)=>{
            
        //clearInterval(waiting);
            currentPlayer = rnd;
            userindex = currentPlayer;
            game = true;
            clearInterval(waiting);
            displayCurrentPlayer();
            rednerStatus(`A játék elindult !`)
            
    })


    socket.on('win', (winner)=>{
        let status = document.querySelector('#status');
        //window.alert(winner + ' nyert!');
        //status.innerHTML = `<h1>${winner} nyert !</h1>`
        rednerStatus(`${winner} nyert !`)
        game = false;
    });
}

function waitingForPlayes2()
{
    let str = document.querySelector('#player2').innerHTML;
    if (str == '') {
        str = 'Várjuk a másik játékost';
        if (str.length < 29)
        {
            str += '.';
        }
    } else {
        rednerStatus(`${str} csatlakozott a játékhoz !`)
        return;
    }
    document.querySelector('#status').innerHTML = str;
}




function setPos(id){
    if (game == false) {
        return;
    }
    //let status = document.querySelector('#status');
    if (currentPlayer == userindex) {
       socket.emit('putCell', id); 
    } else {
        rednerStatus('A másik játékos lép !')
        //status.innerHTML = '<h1>A másik játékos lép !</h1>'
    }
}

function rednerStatus(msg) {
    let status = document.querySelector('#status');
    status.innerHTML = `<h1>${msg}</h1>`;
    setTimeout(() => status.innerHTML = '', 3000);
}

function updateGameRoom(game) {
    document.querySelector(`#player1`).innerHTML = game['player1'][0];
    document.querySelector(`#player2`).innerHTML = game['player2'][0];
    let table = game.table;
    console.log(game['player1'][0]);
    displayCurrentPlayer();
    let counter = 0;
    for(let y = 0; y < 15; y++) {
        for(let x = 0; x < 15; x++) {
            document.getElementById('cell'+counter).classList.add('takeP'+table[y][x]);    
            counter++;
        }
    }
}

function displayCurrentPlayer(){
    if (currentPlayer == 2)
    {
        document.querySelector('.player1-container').classList.remove('player1anim');
        document.querySelector('.player2-container').classList.add('player2anim');
    }
    else
    {
        document.querySelector('.player2-container').classList.remove('player2anim');
        document.querySelector('.player1-container').classList.add('player1anim');
    }
}
