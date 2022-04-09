export const socket = io({transports: ['websocket'], upgrade: false});

export const display = document.querySelector('.chat-display');
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

function outputMessage(message,display) {
    const div = document.createElement('div');
    const span0 = document.createElement('span');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    div.classList.add('message');
    span0.innerHTML = `<span class="message-date">${message.time}</span><span class="message-uname">${message.username}</span><br>`;
    span1.innerHTML = `<span class="message-text">${message.text}</span>`;
    div.appendChild(span0);
    div.appendChild(span1);
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

export {initChat,outputMessage,sendMessage};