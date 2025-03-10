const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (for testing)
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());  // 🛠 FIX: Enable JSON parsing
app.use(express.urlencoded({ extended: true })); // 🛠 Fix for form data

// Mock user database
const users = [];

// Login endpoint
app.post("/login", (req, res) => {
    console.log("Login Request Body:", req.body); // Debugging
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ token: "mock-token", message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// Register endpoint
app.post("/register", (req, res) => {
    console.log("Register Request Body:", req.body); // Debugging
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const userExists = users.some(u => u.username === username);
    if (userExists) {
        res.status(400).json({ message: "Username already exists" });
    } else {
        users.push({ username, password });
        res.json({ message: "Registration successful" });
    }
});

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io.emit("receiveMessage", data); // Broadcast the message to all clients
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server
const PORT = 5500;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});