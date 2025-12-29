"use server"

const { addComplaint } = require("@/data/complaints/complaints");


export const sendComplaint = async (data) => {
    console.log("IAM IN SERVER TRYING TO SEND COMPLAINT");
    const res = await addComplaint(data);
    return res;
};