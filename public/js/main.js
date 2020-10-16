const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, room });

//get roomand users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//output message
socket.on("message", (message) => {
  outputMessage(message);
});

//Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //send msg to the server
  socket.emit("chatMessage", msg);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;

  //Clear Input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output message
const outputMessage = (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta"> ${msg.username} <span> ${msg.time}</span></p>
  <p class="text">
  ${msg.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

//add room name
const outputRoomName = (room) => {
  roomName.innerText = room;
};

//add users
const outputUsers = (users) => {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
};
