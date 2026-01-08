"use server"

const { updateUserSubscription, setRequestAccepted, markReadByAdmin } = require("@/data/dashboard/subscription")


export const updateUserSubscriptionServer = async (userId, subscription) => {
    const res = await updateUserSubscription(userId, subscription);
    return res;
}
export const setRequestAcceptedServer = async (requestId) => {
    const res = await setRequestAccepted(requestId);
    return res;
};
export const markReadByAdminServer = async (id) => {
    const res = await markReadByAdmin(id);
    return res;
};