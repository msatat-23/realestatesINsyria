"use server"
import { getUserPropertiesByUserId } from "@/data/property/property-details";
import { fetchMyPlan } from "@/data/subscriptions/subscriptions";
import { getUserImage } from "@/data/user/get-user-info";
import { fetchPrivacySettings } from "@/data/user/update-user";

export const getUserProperties = async (userId) => {
    console.log("IAM IN SERVER TRYING TO FETCH USER PROPERTIES BY USER ID !!!");
    const properties = await getUserPropertiesByUserId(userId);
    return properties;
};
export const fetchprivacy = async () => {
    console.log("IAM IN SERVER TRYING TO FETCH USER'S PRIVACY SETTINGS!!");
    const res = await fetchPrivacySettings();
    return res;
};
export const fetchUserImage = async () => {
    console.log("IAM IN SERVER TRYING TO FETCH USER IMAGE!!");
    const res = await getUserImage();
    return res;
};
export const getUserSubscription = async () => {
    console.log("IAM IN SERVER TRYING TO FETCH USER SUBSCRIPTION");
    const res = await fetchMyPlan();
    return res;
};