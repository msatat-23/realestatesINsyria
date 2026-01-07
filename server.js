import { WebSocketServer, WebSocket } from "ws";
import 'dotenv/config';
import pkg from "pg";

const { Client } = pkg;

const wss = new WebSocketServer({ port: 3001 });
const users = new Map();


const listener = new Client({
    connectionString: process.env.DATABASE_URL,
});

await listener.connect();
await listener.query('LISTEN new_notification');

listener.on('notification', (msg) => {
    const payload = JSON.parse(msg.payload);
    sendNotificationToUser(String(payload.userId), payload);
});

wss.on("connection", (socket, request) => {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId");
    if (!userId) {
        socket.close();
        return;
    }

    if (!users.has(userId)) {
        users.set(userId, new Set());
    }

    users.get(userId).add(socket);


    socket.send(JSON.stringify({ type: "CONNECTED" }));

    console.log(`🟢 user ${userId} connected`);

    socket.on("close", () => {
        users.get(userId)?.delete(socket);
        if (users.get(userId)?.size === 0) {
            users.delete(userId);
        }
        console.log(`🔴 user ${userId} disconnected`);
    });
});

function sendNotificationToUser(userId, payload) {
    const sockets = users.get(userId);
    if (!sockets) return;

    const message = JSON.stringify({
        type: "NOTIFICATION",
        payload: payload,
    });

    sockets.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    });
}
