"use server"

import { deleteUser, markUserRead, updateUserPropertyState, updateUserRole } from "@/data/dashboard/user";

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
export const updateUserRoleServer = async (userId, newRole) => {
    const res = await updateUserRole(userId, newRole);
    return res;
};
export const deleteUserServer = async (userId) => {
    const res = await deleteUser(userId);
    return res;
};
export const markUserReadServer = async (userId) => {
    const res = await markUserRead(userId);
    return res;
};