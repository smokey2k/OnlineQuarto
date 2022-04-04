$( document ).ready( INIT() );

function INIT() {
    const header = document.querySelector('.main-header');
    const gameListDOM = document.querySelector('#gameList');
    const display = document.querySelector('.chatDisplay');
    const chatInputBox = document.querySelector('.chatInputBox');
    const chatInputButton = document.querySelector('.chatInputButton');
    const socket = io({transports: ['websocket'], upgrade: false});

    chatInputButton.addEventListener('click', (event)=>{
        sendMessage(chatInputBox,socket);
    });
    chatInputBox.addEventListener("keyup", (event)=> {
        if (event.key === 'Enter') {
            sendMessage(chatInputBox,socket);
        }
    });

    socket.emit('joinToGame');
    socket.on('joinedToGame', (msg)=>{
        if (msg !== "") {
            outputMessage(msg,display);    
        }
    });

    socket.on('updateRoom', (room)=>{
        outputRoomName(room,header);
    });

    socket.on('message', (msg)=>{
        outputMessage(msg,display);
    })
    
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
    display.scrollTop = display.scrollHeight;
}

function sendMessage(DOMelement,socket) {
    let msg = DOMelement.value;
    if (msg != '') {
        socket.emit('message',msg);
        DOMelement.value = '';
        DOMelement.focus();
    }
}

// Add roomname to DOM
function outputRoomName(room,DOMelement) {
    DOMelement.innerHTML = room;
}
