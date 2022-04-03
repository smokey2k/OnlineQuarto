//$( document ).ready( INIT() );


function INIT() {

    const display = document.querySelector('#gameChatDisplay');
    const chatInputBox = document.querySelector('#gameChatInputBox');
    const chatInputButton = document.querySelector('#gameChatInputButton');
    const socket = io({transports: ['websocket'], upgrade: false});


    chatInputButton.addEventListener('click', (event)=>{
        sendMessage(chatInputBox,socket);
    });
    chatInputBox.addEventListener("keyup", (event)=> {
        if (event.key === 'Enter') {
            sendMessage(chatInputBox,socket);
        }
    });

    socket.emit('joinToRoom');
    socket.on('joinedToRoom', (msg)=>{
        if (msg !== "") {
            outputMessage(msg,display);    
        }
    });

/*    socket.on('updateRoom', (room,users)=>{
        outputUserList(users,gameListDOM);
        console.log(socket.id);
    });
*/
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
}

function sendMessage(DOMelement,socket) {
    let msg = DOMelement.value;
    if (msg != '') {
        socket.emit('message',msg);
        DOMelement.value = '';
        DOMelement.focus();
    }
}

