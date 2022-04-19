import { socket,chat_display,initChat,outputMessage,displayChatHistory } from '/js/quarto/widgets/chat.js'

let currentPlayer;
let gameState;
let userindex;
let player1;
let player2;

$( document ).ready( INIT() );

function INIT() {
    initChat();
    player1 = document.querySelector('#player1');
    player2 = document.querySelector('#player2');

    for(let i=0; i<225; i++) {
        document.querySelector(`#cell${i}`).addEventListener('click', (event)=>{
             setPos(i);
        }); 
    }
    socket.emit(`joinToGame`);

    // socket.on("connect", () => {});
    // socket.on("disconnect", () => {});

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
        if (userNr == 1) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
        }
        displayCurrentPlayer();
     });

     socket.on('gameStarted', (rnd,game)=>{
            currentPlayer = rnd;
            userindex = currentPlayer;
            game.game = gameState;
            displayCurrentPlayer();
            renderStatus(`A játék elindult !`,3000)
        })


    socket.on('win', (winner,state)=>{
        let status = document.querySelector('#status');
        renderStatus(`${winner} nyert !`,6000)
        renderWin(winner);
        gameState = state;
    });
    
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


function setPos(id){
    if (gameState == false) {
        return;
    }
    if (currentPlayer == userindex) {
       socket.emit('putCell', id); 
    } else {
        renderStatus('A másik játékos lép !',4000);
    }
}

function renderStatus(msg,timeout) {
    let status = document.querySelector('#status');
    status.innerHTML = `<h1>${msg}</h1>`;
    setTimeout(() => status.innerHTML = '', timeout);
}


function updateGameRoom(game) {
    document.querySelector(`#player1`).innerHTML = game['player1'][0];
    document.querySelector(`#player2`).innerHTML = game['player2'][0];
    let str = document.querySelector('#player2').innerHTML;
    if (str == '') {
        document.querySelector('#status').innerHTML = `<h1>Várjuk a másik játékost !</h1>`;
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

function displayCurrentPlayer(){
    if (player2.innerHTML != '') {
        if (currentPlayer == 2) {
            renderStatus(`${player2.innerHTML} lép !`,4000);
        } else {
            renderStatus(`${player1.innerHTML} lép !`,4000);
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
