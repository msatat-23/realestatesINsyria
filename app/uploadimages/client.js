"use client";
import { useEffect, useState } from "react";
import { sendImageToDB } from "../addproperty/[id]/send-data";

const Client = () => {
    const [image, setimage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [propertyId, setPropertyId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(image);
        setPreview(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [image]);
    const upload = async () => {
        if (!image) {
            alert('لايوجد صورة!');
            return;
        }
        if (!propertyId) {
            alert('رقم العقار مفقود!');
            return;
        }
        const fd = new FormData();
        fd.append("file", image);
        fd.append("propertyId", propertyId);
        setLoading(true);
        try {
            const res = await fetch("/api/property/upload-images", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            console.log(data);
            const response = await sendImageToDB(data.url, data.public_id, propertyId);
            console.log(response);
            setUploaded(true);
        }
        catch (e) {
            console.log("خطأ في رفع الصورة!", e);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center relative min-h-screen">
            <div className="flex justify-center items-center gap-20 w-full">
                <input
                    id="imageupload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        setUploaded(false);
                        setimage(e.target.files[0]);
                    }}
                    className="hidden"
                />
                <label
                    htmlFor="imageupload"
                    className="text-center font-bold text-[16px] border border-blue-900 bg-blue-900 hover:bg-[#1e0079] cursor-pointer py-[12px] px-[24px] rounded-[12px] text-white"
                >
                    اضغط لاختيار الصورة
                </label>

                <input
                    type="number"
                    value={propertyId || ""}
                    onChange={(e) => {
                        setUploaded(false);
                        setPropertyId(e.target.value);
                    }}
                    placeholder="property id"
                    className="border-[3px] outline-0 w-[300px] h-[45px] rounded-2xl p-2 placeholder:ltr"
                    dir="ltr"
                />
            </div>

            {image && (
                <img
                    className="w-[300px] mt-[100px] rounded-2xl shadow-md border"
                    src={preview}
                    alt="preview"
                />
            )}

            <button
                onClick={upload}
                className={`mt-[30px] py-4 px-8 rounded-2xl text-white text-[18px] 
                ${loading || uploaded ? 'bg-gray-500 cursor-not-allowed' : 'bg-sky-700 cursor-pointer hover:bg-sky-900'}`}
                disabled={loading || uploaded}
            >
                ارفع الصورة
            </button>

            {loading && (
                <div className="rounded-full w-[30px] h-[30px] border-[5px] border-sky-950 border-l-transparent animate-spin mt-[20px]"></div>
            )}
        </div>
    );
};

export default Client;
