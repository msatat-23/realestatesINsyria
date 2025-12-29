"use server"

import { updateUserPropertyState } from "@/data/dashboard/user";

const { getAllUserDataForAdmin, getAllUserPropertiesForAdmin } = require("@/data/user/get-user-info");


export const getAllUserDataForAdminServer = async (id) => {
    const res = await getAllUserDataForAdmin(id);
    return res;
};
export const getAllUserPropertiesForAdminServer = async (id) => {
    const res = await getAllUserPropertiesForAdmin(id);
    return res;
};
export const updateUserPropertyStateServer = async (propertyId, state) => {
    const res = await updateUserPropertyState(propertyId, state);
    return res;
};