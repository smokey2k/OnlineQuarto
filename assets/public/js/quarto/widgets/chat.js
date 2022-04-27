export const socket = io({transports: ['websocket'], upgrade: false});
import { updateGameList,gameListDOM } from '/js/quarto/widgets/gamelist.js'

export const chat_display = document.querySelector('.chat-display');
const chatInputBox = document.querySelector('.chat-input-box');
const chatInputButton = document.querySelector('.chat-input-button');

function initChat() {
    // send button click function listener
    chatInputButton.addEventListener('click', (event)=>{
        sendMessage(chatInputBox,socket); });
     // enter key listener   
    chatInputBox.addEventListener("keyup", (event)=> {
        if (event.key === 'Enter') { sendMessage(chatInputBox,socket);} });
    // message to the server is someone send a message
    socket.on('message', (msg)=>{
        outputMessage(msg);
    });
    // load the chat history from database and display it
    socket.on('chat-history', (data)=>{
        displayChatHistory(data);
    });
    // update the lobby room game list widget
    socket.on(`updateLobby`, (games)=>{
        updateGameList(games,gameListDOM,socket);
    });

}
// display a message in the chat display window
function outputMessage(msg) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.innerHTML = `
        <span class="message-date">${msg.time}&ensp; <span class="message-uname">${msg.username}</span></span>
        <span class="message-text">${msg.text}</span>
    `;
    chat_display.appendChild(message);
    chat_display.scrollTop = chat_display.scrollHeight - chat_display.clientHeight;
}

// send a message to the server
function sendMessage(DOMelement,socket) {
    let msg = DOMelement.value;
    if (msg != '') {
        socket.emit('message',msg);
        DOMelement.value = '';
        DOMelement.focus();
    }
}

// display the chat history in the chat window
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