"use server"

import { fetchUnreadCountForAdmin } from "@/data/count/count";

export const fetchUnreadCountForAdminServer = async () => {
    const res = await fetchUnreadCountForAdmin();
    return res;
};