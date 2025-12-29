"use client"
import { createContext, useContext, useState, useRef, useEffect } from "react";
import NotificatioSidebar from "./notifications";

const NotificationContext = createContext(null);

export const useNotificationUI = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotificationUI must be used inside NotificationsProvider");
    }
    return ctx;
};

const NotificationsProvider = ({ userId, children }) => {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log("CONNECTION STATUS : ", connected);
        console.log("UNREAD COUNT : ", unreadCount);
    }, [connected, unreadCount]);

    useEffect(() => {
        if (!userId) return;
        socketRef.current = new WebSocket(
            `ws://localhost:3001?userId=${userId}`
        );

        socketRef.current.onopen = () => {
            setConnected(true);
        };

        socketRef.current.onmessage = (event) => {
            console.log("WS MESSAGE:", event.data);
            const msg = JSON.parse(event.data);
            if (msg.type === "NOTIFICATION") {
                setUnreadCount(prev => prev + 1);
            }
        };

        socketRef.current.onclose = () => {
            setConnected(false);
        };

        return () => {
            socketRef.current.close();
        };

    }, [userId]);

    return <NotificationContext.Provider value={{ open, setOpen, unreadCount, setUnreadCount, connected }}>
        {children}
        {open && <NotificatioSidebar close={() => setOpen(false)} />}
    </NotificationContext.Provider>
}
export default NotificationsProvider;