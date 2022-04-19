export const socket = io({transports: ['websocket'], upgrade: false});
import { updateGameList,gameListDOM } from '/js/quarto/widgets/gamelist.js'

export const chat_display = document.querySelector('.chat-display');
const chatInputBox = document.querySelector('.chat-input-box');
const chatInputButton = document.querySelector('.chat-input-button');

function initChat() {
    chatInputButton.addEventListener('click', (event)=>{
        sendMessage(chatInputBox,socket); });
    chatInputBox.addEventListener("keyup", (event)=> {
        if (event.key === 'Enter') { sendMessage(chatInputBox,socket);} });

    socket.on('message', (msg)=>{
        outputMessage(msg);
    });
    socket.on('chat-history', (data)=>{
        displayChatHistory(data);
    });
    socket.on(`updateLobby`, (games)=>{
        updateGameList(games,gameListDOM,socket);
    });

}

function outputMessage(msg) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.innerHTML = `
        <span class="message-date">${msg.time}&ensp; <span class="message-uname">${msg.username}</span></span>
        <span class="message-text">${msg.text}</span>
    `;
    chat_display.appendChild(message);
    chat_display.scrollIntoView({behavior: "smooth"});
    chat_display.scrollTop = chat_display.scrollHeight - chat_display.clientHeight;
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
    const history = document.createElement('div');
    history.classList.add('chat-history');
    for (var i = 0; i < data.length; i++){
        const mesage = document.createElement('div');
        mesage.classList.add('message');
        mesage.innerHTML = `
        <span class="message-date">${data[i].date}&ensp; <span class="message-uname">${data[i].username}</span></span>
        <span class="message-text">${data[i].text}</span>`;
        history.appendChild(mesage);
    }
    chat_display.appendChild(history);
    chat_display.scrollTop = chat_display.scrollHeight - chat_display.clientHeight;
}

export {initChat,outputMessage,sendMessage,displayChatHistory};