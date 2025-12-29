"use server"
import { updateMyPlanRequest } from "@/data/subscriptions/subscriptions";
import { changePassword } from "@/data/user/change-password";
import { changePrivacySettings, deleteUser, setTwoStepVerification, updateuser, updateUserImage } from "@/data/user/update-user";


export const updateUserByUserId = async (data) => {
    console.log("IAM IN SERVER TRYING TO UPDATE USER BY USER ID!!");
    const res = await updateuser(data);
    return res;
};
export const updatePassword = async (oldpassword, newpassword) => {
    console.log("IAM IN SERVER TRYING TO UPDATE USER PASSWORD!!");
    const res = await changePassword(oldpassword, newpassword);
    return res;
};
export const updatePrivacy = async (privacy) => {
    console.log("IAM IN SERVER TRYING TO UPDATE USER'S PRIVACY SETTINGS!!");
    const res = await changePrivacySettings(privacy);
    return res;
}
export const updateImage = async (secure_url, public_id) => {
    console.log("IAM IN SERVER TRYING TO UPDATE USER IMAGE IN DB!!");
    const res = await updateUserImage(secure_url, public_id);
    return res;
};
export const sendSubscripeRequest = async (data) => {
    console.log("IAM IN SERVER TRYING TO SEND SUBSCRIPTION REQUEST!!");
    const res = await updateMyPlanRequest(data);
    return res;
};
export const deleteUserServer = async () => {
    console.log("IAM IN SERVER TRYING TO DELETE USER!!");
    const res = await deleteUser();
    return res;
};
export const setTwoStepVerificationServer = async (active) => {
    console.log("IAM IN SERVER TRYING TO SET TWO STEP VERIFICATION!!");
    const res = await setTwoStepVerification(active);
    return res;
};
