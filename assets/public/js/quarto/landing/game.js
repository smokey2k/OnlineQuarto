import { socket,chat_display,initChat,outputMessage,displayChatHistory } from '/js/quarto/widgets/chat.js'

let currentPlayer;
let gameState;
let userindex;
let player1;
let player2;


// wait till page fully loaded
$( document ).ready( INIT() );

function INIT() {
    // initialise the chat window
    initChat();
    player1 = document.querySelector('#player1');
    player2 = document.querySelector('#player2');

    // fill the game table cells with on click function
    for(let i=0; i<225; i++) {
        document.querySelector(`#cell${i}`).addEventListener('click', (event)=>{
             setPos(i);
        }); 
    }

    // join to the game room
    socket.emit(`joinToGame`);
    
    // if we joined get the message from the server
    socket.on(`joinedToGame`, (msg)=>{
        if (msg !== "") {
            outputMessage(msg,chat_display);    
        }
    });

    // update the game room on page refresh or any other situations
    socket.on('updateGameRoom', (game)=>{
        updateGameRoom(game);
    })

    // get the user index number from the actual game object
    socket.on('UserIndex', (index)=>{
        userindex = index;
    })

    // when the other player put his pupet on the table we got this message from the server
    socket.on('drawCell', (id, userNr)=>{
        let currentCell = document.getElementById('cell'+id);
        currentCell.classList.add('takeP'+userNr);
        if (userNr == 1) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
        }
        displayCurrentPlayer();
     });

     // the game started message from the server side
     socket.on('gameStarted', (rnd,game)=>{
            currentPlayer = rnd;
            game.game = gameState;
            displayCurrentPlayer();
            renderStatus(`The game has been started !`,3000)
        })

    // if the server find out someone win we will get this message
    socket.on('win', (winner,state)=>{
        let status = document.querySelector('#status');
        renderStatus(`${winner} won the game !`,6000)
        renderWin(winner);
        gameState = state;
    });
    
    // if a player leave the game the game is over
    socket.on('gameAborted', ()=>{
        $.ajax('/lobby', {
            type: 'POST',
            data: '',
            success: function(data){
                location.href = '/lobby';
            }
        });
    });
}

// when on client side a plyer clicks on the table cell and put his pupet
function setPos(id){
    if (gameState == false) {
        return;
    }
    if (currentPlayer == userindex) {
       socket.emit('putCell', id); 
    } else {
        var msg;
        if (currentPlayer = 1) {
            msg = player1.innerHTML;
        } else {
            msg = player2.innerHTML;
        }
        renderStatus(`It's ${msg} turn !`,4000);
    }
}

// the actual action to display on status section
function renderStatus(msg,timeout) {
    let status = document.querySelector('#status');
    status.innerHTML = `<h1>${msg}</h1>`;
    setTimeout(() => status.innerHTML = '', timeout);
}

// updating the game room on page refresh or if a player logs back to server
function updateGameRoom(game) {
    document.querySelector(`#player1`).innerHTML = game['player1'][0];
    document.querySelector(`#player2`).innerHTML = game['player2'][0];
    let str = document.querySelector('#player2').innerHTML;
    if (str == '') {
        document.querySelector('#status').innerHTML = `<h1>Awaiting for other player....</h1>`;
    }
    currentPlayer = game.currPlayer
    gameState = game.gameState;
    displayCurrentPlayer();
    let table = game.table;
    let counter = 0;
    for(let y = 0; y < 15; y++) {
        for(let x = 0; x < 15; x++) {
            document.getElementById('cell'+counter).classList.add('takeP'+table[y][x]);    
            counter++;
        }
    }
}

// displaying the actual player in status section and color animating his name tag
function displayCurrentPlayer(){
    if (player2.innerHTML != '') {
        if (currentPlayer == 2) {
            renderStatus(`It's ${player2.innerHTML} turn !`,4000);
        } else {
            renderStatus(`It's ${player1.innerHTML} turn !`,4000);
        }
    }
    
    if (currentPlayer == 2) {
        document.querySelector('.player1-container').classList.remove('player1anim');
        document.querySelector('.player2-container').classList.add('player2anim');
    } else {
        document.querySelector('.player2-container').classList.remove('player2anim');
        document.querySelector('.player1-container').classList.add('player1anim');
    }
}

// if someone wins this wil render a modal window 
function renderWin(winner) {
    var container = document.querySelector('.modal-ok-container');
    document.querySelector('.button_cancel').style.display = 'none';
    container.innerHTML = '';
    var content = document.querySelector('.modal-content');
    content.innerHTML = `<h1>${winner} won the game !</h1>`;
    var form = document.createElement("form");
    form.setAttribute('id','to-lobby');
    form.setAttribute("method", "get");
    var submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute('id','logout-button');
    submitButton.value = 'OK';
    submitButton.classList.add('button','button_lobby');
    form.appendChild(submitButton);
    container.appendChild(form);
    
    // ajax submit 
    $("#to-lobby").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/lobby",
            type: "POST",
            data: '',
            success: function(data){
                location.href = '/lobby';
            }
        });
    });
    document.querySelector('.modal-wrapper').style.display = 'flex';
}
