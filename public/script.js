const socket = io();
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    socket.emit('message', message);
    messageInput.value = '';
});
socket.on('message', (message) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messages.appendChild(messageElement);
});