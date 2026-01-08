import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;

const wss = new WebSocketServer({ port: 3002 });
const users = new Map();

const listener = new Client({
    connectionString: process.env.DATABASE_URL
});

await listener.connect();
await listener.query("LISTEN db_changes");

listener.on("notification", (msg) => {
    const payload = JSON.parse(msg.payload);
    notifyAdmin(payload);
});
wss.on("connection", (socket, request) => {

    const url = new URL(request.url, "http://localhost");
    const token = url.searchParams.get("token");
    if (!token) {
        socket.close(4001, "Unauthorized");
        return;
    }
    console.log(`🟢 user connected`);
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        socket.close(4001, "INVALID TOKEN");
        return;
    }

    const userId = payload.userId;
    const role = payload.role;

    socket.user = { userId, role };

    if (!users.has(userId)) {
        users.set(userId, new Set());
    }
    users.get(userId).add(socket);

    console.log(users);

    socket.send(JSON.stringify({
        type: "CONNECTED",
        userId,
        role
    }));


    console.log(`user ${userId} role ${role} 🟢 connected`);
    socket.send("welcome to websocket");


    socket.on("message", (msg) => {
        console.log(`received ${msg} from user`);
        socket.send(`You said: ${msg}`);
    });

    socket.on("close", () => {
        console.log(`user ${userId} role ${role} 🔴 disconnected`);
        users.get(userId)?.delete(socket);
        if (users.get(userId)?.size === 0) {
            users.delete(userId);
        }
    });
});

const notifyAdmin = (payload) => {
    users.forEach(user => user.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "NEW_INSERTED", payload }))
        }
    }
    ));
};

