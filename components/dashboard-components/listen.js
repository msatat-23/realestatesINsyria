"use client"

import { fetchUnreadCountForAdminServer } from "@/app/dashboard/server-actions";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    const fetchcount = async () => {
        try {
            const res = await fetchUnreadCountForAdminServer();
            const data = res.data;
            setUserCount(data[0]);
            setPropertyCount(data[1]);
            setSubRequestCount(data[2]);
            setComplaintCount(data[3]);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchcount();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("ws_token");
        socket.current = new WebSocket(`ws://localhost:3002?token=${token}`);
        socket.current.onopen = () => {
            setConnected(true);
            console.log("🟢connected to admin-server");
        };
        socket.current.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            if (data.type === "NEW_INSERTED") {
                console.log(data.payload);
                fetchcount();
                router.refresh();
            }
        };
        socket.current.onclose = () => {
            console.log("🔴disconnected from admin-server");
            setConnected(false);
        };
    }, []);

    return <AdminContext.Provider value={{
        connected,
        propertyCount,
        userCount,
        subRequestCount,
        complaintCount,
        setUserCount,
        setPropertyCount,
        setSubRequestCount,
        setComplaintCount,
        fetchcount
    }}>
        {children}
    </AdminContext.Provider>
};