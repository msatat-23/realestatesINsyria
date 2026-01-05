"use server"

const { updateUserSubscription, setRequestAccepted } = require("@/data/dashboard/subscription")


export const updateUserSubscriptionServer = async (userId, subscription) => {
    const res = await updateUserSubscription(userId, subscription);
    return res;
}

export const setRequestAcceptedServer = async (requestId) => {
    const res = await setRequestAccepted(requestId);
    return res;
};