// WebSocket serverga ulanish
const socket = new WebSocket(`ws://${window.location.hostname}:3000`); // Dinamik manzil

// Xabar yuborish tugmasi bosilganida
document.getElementById("send-button").addEventListener("click", function() {
  const messageInput = document.getElementById("message-input");
  const usernameInput = document.getElementById("username");
  const message = messageInput.value.trim();
  const username = usernameInput.value.trim();

  if (message && username) {
    socket.send(JSON.stringify({ username: username, message: message }));
    messageInput.value = ""; // Inputni tozalash
  }
});

// Serverdan xabarni olish va ekranga chiqarish
socket.addEventListener('message', function(event) {
  const chatBox = document.getElementById("chat-box");
  const data = JSON.parse(event.data);

  const messageElement = document.createElement("div");
  messageElement.textContent = `${data.username}: ${data.message}`;
  chatBox.appendChild(messageElement);

  // Scrollni pastga tushurish
  chatBox.scrollTop = chatBox.scrollHeight;
});
