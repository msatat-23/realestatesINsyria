"use server"

import { markRead } from "@/data/dashboard/complaints";



export const markReadServer = async (id) => {
    const res = await markRead(id);
    return res;
};