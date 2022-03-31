$( document ).ready( socketINIT() );

function socketINIT() {
    const roomNameDOM = document.querySelector('#roomName');
    const gameListDOM = document.querySelector('#gameList');
    const display = document.getElementById('chatDisplay');
    const chatInputBox = document.querySelector('#chatInputBox');
    const chatInputButton = document.querySelector('#chatInputButton');
    const socket = io({transports: ['websocket'], upgrade: false});

    chatInputButton.addEventListener('click', (event)=>{
        sendMessage(chatInputBox,socket);
    });
    chatInputBox.addEventListener("keyup", (event)=> {
        if (event.key === 'Enter') {
            sendMessage(chatInputBox,socket);
        }
    });
   

    //userInfo = Object.assign({room: 'lobby'}, userInfo);
    
    socket.emit('joinToRoom', userInfo );
    socket.on('joinedToRoom', (msg)=>{
        document.getElementById("socketInfo").innerHTML = socket.id;
        if (msg !== "") {
            outputMessage(msg,display);    
        }
    });

    socket.on('updateRoom', (room,users)=>{
        outputRoomName(room,roomNameDOM);
        outputUserList(users,gameListDOM);
    });

    //receive a message
    socket.on('message', (msg)=>{
        outputMessage(msg,display);
    })

}

// Add roomname to DOM
function outputRoomName(room,DOMelement) {
    DOMelement.innerHTML = room;
}

// Add users to DOM
function outputUserList(users,DOMelement) {
    DOMelement.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = user.name;
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
}

function sendMessage(DOMelement,socket) {
    let msg = DOMelement.value;
    if (msg != '') {
        socket.emit('message',msg);
        DOMelement.value = '';
        DOMelement.focus();
    }
}