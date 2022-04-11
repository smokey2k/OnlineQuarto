export const socket = io({transports: ['websocket'], upgrade: false});

export const chat_display = document.querySelector('.chat-display');
const chatInputBox = document.querySelector('.chat-input-box');
const chatInputButton = document.querySelector('.chat-input-button');

function initChat() {
    
    chatInputButton.addEventListener('click', (event)=>{
        sendMessage(chatInputBox,socket);
    });
    
    chatInputBox.addEventListener("keyup", (event)=> {
        if (event.key === 'Enter') { sendMessage(chatInputBox,socket);}
    });
}

function outputMessage(message,chat_display) {
    const div = document.createElement('div');
    const span0 = document.createElement('span');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    div.classList.add('message');
    span0.innerHTML = `<span class="message-date">${message.time}</span><span class="message-uname">${message.username}</span><br>`;
    span1.innerHTML = `<span class="message-text">${message.text}</span>`;
    div.appendChild(span0);
    div.appendChild(span1);
    chat_display.appendChild(div);
}

function sendMessage(DOMelement,socket) {
    let msg = DOMelement.value;
    if (msg != '') {
        socket.emit('message',msg);
        DOMelement.value = '';
        DOMelement.focus();
    }
}

function displayChatHistory(data) {
    const div = document.createElement('div');
    div.classList.add('chat-history');
    for (var i = 0; i < data.length; i++){
        const p = document.createElement('p');
        p.classList.add('user-name');
        p.innerText = data[i].username;
        p.innerHTML += `<span>${data[i].date}</span>`;
        div.appendChild(p);
        const p2 = document.createElement('p');
        p2.innerText = data[i].text;
        div.appendChild(p2);
    }
    chat_display.appendChild(div);
    chat_display.scrollTop = chat_display.scrollHeight - chat_display.clientHeight;
}


export {initChat,outputMessage,sendMessage,displayChatHistory};