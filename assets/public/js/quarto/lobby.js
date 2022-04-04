$( document ).ready( INIT() );


function INIT() {
    //const roomNameDOM = document.querySelector('#roomName');
    //const createGameForm = document.querySelector('#createGameForm');
    const header = document.querySelector('.main-header');
    const createGameButton = document.querySelector('#createGameButton');
    const gameListDOM = document.querySelector('#gameList');
    const display = document.querySelector('.chatDisplay');
    const chatInputBox = document.querySelector('.chatInputBox');
    const chatInputButton = document.querySelector('.chatInputButton');
    const socket = io({transports: ['websocket'], upgrade: false});

    $("#createGameButtonForm").submit(function(e) {
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

    
    chatInputButton.addEventListener('click', (event)=>{
        sendMessage(chatInputBox,socket);
    });
    chatInputBox.addEventListener("keyup", (event)=> {
        if (event.key === 'Enter') {
            sendMessage(chatInputBox,socket);
        }
    });
    
    
    socket.emit('joinToLobby');
    socket.on('joinedToLobby', (msg)=>{
        //document.getElementById("socketInfo").innerHTML = socket.id;
        if (msg !== "") {
            outputMessage(msg,display);    
        }
    });

    socket.on('updateLobbyRoom', (room,games)=>{
        outputRoomName(room,header);
        //outputUserList(users,gameListDOM);
        updateGameList(games,gameListDOM,socket);
        //console.log(socket.id);
    });

    //receive a message
    socket.on('message', (msg)=>{
        outputMessage(msg,display);
    })

    socket.on('gameCreated', (games,game)=>{
        updateGameList(games,gameListDOM,socket);
    })
}

// Add roomname to DOM
function outputRoomName(room,DOMelement) {
    DOMelement.innerHTML = room;
}


function updateGameList(games,DOMelement,socket) {
    DOMelement.innerHTML = '';
    for (let i = 0; i < games.length; i++) {
        const li = document.createElement('li');
        var form = document.createElement("form");
        form.setAttribute('id','joinGameButtonForm');
        form.setAttribute("method", "post");
        var submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.value = games[i].split('-').pop(); 
        submitButton.classList.add("button_game","button_blue");
        submitButton.setAttribute('id',`${games[i]}`);
        form.appendChild(submitButton);
        li.appendChild(form);
        DOMelement.appendChild(li);
        $("#joinGameButtonForm").submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: "/game",
                type: "POST",
                data: {'gameroom': `${games[i]}`},
                success: function(data){
                    //socket.emit('joinGame',`${games[i]}`);
                    location.href = '/game';
                }
            });
        });
    }
}

// Add users to DOM
function outputUserList(users,DOMelement) {
    DOMelement.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('userButton');
        li.innerHTML = `<div><span>${user.userID}<br>${user.name}<br>${user.room}<br>${user.socketID}</span><div>`;
        DOMelement.appendChild(li); 
    });
}

// Add messages to DOM
function outputMessage(message,display) {
    const div = document.createElement('div');
    div.classList.add('message');
    const span = document.createElement('span');
    span.classList.add('uname');
    span.innerHTML = `<span>${message.time} : </span>`;
    span.innerHTML += `<span>${message.username} mesage:</span><br>`;
    div.appendChild(span);
    const span2 = document.createElement('span');
    span2.innerHTML = `<span>${message.text}</span>`;
    div.appendChild(span2);
    display.appendChild(div);
    //display.scrollTop = display.scrollHeight - display.clientHeight;
}

function sendMessage(DOMelement,socket) {
    let msg = DOMelement.value;
    if (msg != '') {
        socket.emit('message',msg);
        DOMelement.value = '';
        DOMelement.focus();
    }
}


function createGame(socket,userInfo,form) {
};
