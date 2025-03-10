const socket = io("http://localhost:5500"); // Fixed the port

let username = "";

// Debugging: Log connection status
socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("receiveMessage", (data) => {
    console.log("Message received:", data);
    const messageBox = document.getElementById("messages");
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${data.sender}:</strong> ${data.content} <small>${new Date(data.timestamp).toLocaleTimeString()}</small>`;
    messageBox.appendChild(messageElement);
    messageBox.scrollTop = messageBox.scrollHeight;
});

function login() {
    username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    fetch("http://localhost:5500/login", { // Fixed the port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            document.querySelector(".login-box").style.display = "none";
            document.getElementById("chat-container").style.display = "block";
        } else {
            alert("Login failed: " + (data.message || "Invalid credentials"));
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
        alert("Login failed due to an error.");
    });
}

function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    fetch("http://localhost:5500/register", { // Fixed the port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error("Error during registration:", error);
        alert("Registration failed due to an error.");
    });
}

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (message !== "") {
        console.log("Sending message:", message);
        socket.emit("sendMessage", { sender: username, content: message, timestamp: new Date() });
        messageInput.value = "";
    }
}

// Send message on Enter key press
document.getElementById("messageInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});