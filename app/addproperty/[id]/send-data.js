"use server"

import { sendBasicData, sendImage, sendImages, sendVideo, setAmenities, setPropertyCompleted, updateBasicData } from "@/data/property/add-property";
import { addPropertyToFavorites } from "@/data/property/saved-properties";


export const submitBasicPropertyData = async (data) => {
    console.log("I AM IN USE SERVER!!!");
    const res = await sendBasicData(data);
    return res;
};
export const updateBasicPropertyData = async (id, data) => {
    console.log("I AM IN SERVER UPDATING THE PROPERTY!!");
    const res = await updateBasicData(id, data);
    return res;
};
export const sendImagesToDB = async (images, propertyId) => {
    console.log("I AM IN SERVER SENDING IMAGES TO DB!!");
    const res = await sendImages(images, propertyId);
    return res;
};
export const sendImageToDB = async (secure_url, public_id, propertyId) => {
    console.log("I AM IN SERVER SENDING IMAGE TO DB!!");
    const res = await sendImage(secure_url, public_id, propertyId);
    return res;
};
export const sendVideoToDB = async (video_url, video_public_id, propretyId) => {
    console.log("I AM IN SERVER ABOUT TO SEND VIDEO_URL");
    const res = await sendVideo(video_url, video_public_id, propretyId);
    return res;
};
export const addAmenities = async (data) => {
    console.log("IAM IN SERVER TRYING TO SEND AMENITIES!!!");
    const res = await setAmenities(data);
    return res;
};
export const setCompleted = async (id) => {
    console.log("IAM IN SERVER TRYING TO SET COMPLETED!!!");
    const res = await setPropertyCompleted(id);
    return res;
};
export const addPropTofavorite = async (propertyId) => {
    console.log("IAM IN SERVER TRYING TO ADD PROPERTY TO FAVORITE!!!");
    const res = await addPropertyToFavorites(propertyId);
    return res;
}