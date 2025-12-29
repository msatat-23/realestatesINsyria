"use server"

import { getNotifications, markNotificationRead, markNotificationsRead } from "@/data/notifications/notifications";

export const fetchAllNotifications = async () => {
    console.log("IAM IN SERVER FETCHING NOTIFICATIONS!!!");
    const res = await getNotifications();
    return res;
};
export const markRead = async (id) => {
    console.log("IAM IN SERVER MARKING NOTIFICATION READ!!!");
    const res = await markNotificationRead(id);
    return res;
};
export const markAllRead = async () => {
    console.log("IAM IN SERVER MARKING NOTIFICATIONS READ!!!");
    const res = await markNotificationsRead();
    return res;
};