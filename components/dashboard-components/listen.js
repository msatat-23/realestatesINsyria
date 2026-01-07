"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react";


const AdminContext = createContext(null);

export const useAdminContext = () => {
    const ctx = useContext(AdminContext);
    if (!ctx) return null;
    return ctx;
};

export const AdminContextProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);

    const [propertyCount, setPropertyCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [subRequestCount, setSubRequestCount] = useState(0);
    const [complaintCount, setComplaintCount] = useState(0);

    const socket = useRef(null);



    useEffect(() => {
        const token = localStorage.getItem("ws_token");
        socket.current = new WebSocket(`ws://localhost:3002?token=${token}`);
        socket.current.onopen = () => {
            setConnected(true);
            console.log("🟢connected to admin-server");
        };
        socket.current.onmessage = (msg) => {
            const payload = JSON.parse(msg.data);
            console.log(payload);
        };
        socket.current.onclose = () => {
            console.log("🔴disconnected from admin-server");
            setConnected(false);
        };
    }, []);

    return <AdminContext.Provider value={{ connected, propertyCount, userCount, subRequestCount, complaintCount }}>
        {children}
    </AdminContext.Provider>
};