"use client"

import { getFullDetails, getIdBySecureUrl, getImagesSecureUrl } from "@/app/addproperty/[id]/get-data";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Loading from "../loading/loading";
import { sendImagesToDB } from "@/app/addproperty/[id]/send-data";
import { deleteImageFromDB } from "@/app/addproperty/[id]/delete-data";
import imageCompression from "browser-image-compression";
const Images = (props) => {
    const [propertyId, setPropertyId] = useState();
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [uploaded, setUploaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [Deleting, setDeleting] = useState(false);
    const [LoadingImages, setLoadingImages] = useState(false);
    useEffect(() => {
        const getProperty = async (id) => {
            const property = await getFullDetails(id);
            if (property) {
                try {
                    setLoadingImages(true);
                    const imagesFromDB = await getImagesSecureUrl(id);
                    console.log(imagesFromDB);
                    if (imagesFromDB) {
                        const newimages = [];
                        for (const image of imagesFromDB) {
                            newimages.push({ id: uuidv4(), src: image.secure_url });
                        }
                        setImages(newimages);
                    }
                }
                catch (e) {
                    console.log("خطأ في جلب الصور", e);
                }
                finally {
                    setLoadingImages(false);
                }
            }
        }


        const propertyId = localStorage.getItem("propertyId");
        if (!propertyId) {
            if (localStorage.getItem("currentStep") !== 1) {
                localStorage.setItem("currentStep", 1);
            }
            setPropertyId(null);
        } else {
            setPropertyId(propertyId);
            getProperty(propertyId);

        }
    }, []);
    useEffect(() => {
        return () => {
            images.forEach(img => img.preview && URL.revokeObjectURL(img.preview));
        }
    }, []);
    const imageChangeHandler = (e) => {
        const files = Array.from(e.target.files || []);
        const newfiles = [];
        const MAX_FILES = 20;
        const MAX_SIZE = 10 * 1024 * 1024;
        if ((images.length + files.length) > MAX_FILES) {
            setError('الحد الأقصى للصور هو 20 صورة!');
            return;
        }
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                setError("الرجاء اختيار صور فقط !");
                continue;
            }
            if (file.size > MAX_SIZE) {
                setError('حجم الصورة أكبر من 10 MB الرجاء رفع صور بحجم أقل من 10 MB.');
                continue;
            }
            else {
                setError('');
            }
            newfiles.push({ id: uuidv4(), file, preview: URL.createObjectURL(file) });
        }
        setImages(prev => [...prev, ...newfiles]);
    }
    useEffect(() => {
        console.log(images);
    }, [images]);



    const uploadImages = async () => {
        setError('');
        setProgress(0);

        if (!propertyId) {
            setError('رقم العقار غير موجود.');
            return;
        }

        if (images.length === 0) {
            setError('لا توجد صور للرفع.');
            return;
        }
        const imagesToUpload = images.filter(img => img.file instanceof File);
        if (imagesToUpload.length === 0) {
            setError('لا توجد صور جديدة للرفع.');
            return;
        }

        setLoading(true);
        setUploaded(false);
        const uploadedImages = [];

        for (let i = 0; i < imagesToUpload.length; i++) {
            const compressedImg = await imageCompression(imagesToUpload[i].file, {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            });
            // const img = imagesToUpload[i];
            const fd = new FormData();
            fd.append('file', compressedImg);
            fd.append('propertyId', propertyId);

            try {
                const res = await fetch('/api/property/upload-images', {
                    method: 'POST',
                    body: fd,
                });
                const data = await res.json();
                console.log(data);
                uploadedImages.push(data);

                setProgress(Math.round(((i + 1) / imagesToUpload.length) * 100));
            } catch (e) {
                console.log('فشل رفعه احدى الصور', e);
                setError('فشل رفع إحدى الصور.');
                break;
            }
        }

        setLoading(false);

        if (!error) {
            setUploaded(true);
            setProgress(100);
            console.log('روابط الصور المرفوعة:', uploadedImages);
            const dataBaseImages = [];
            for (const uploadedImage of uploadedImages) {
                const public_id = uploadedImage.public_id;
                const url = uploadedImage.url;
                dataBaseImages.push({ public_id, url });
            }
            try {
                const sendToDB = await sendImagesToDB(dataBaseImages, propertyId);
                console.log(sendToDB);
            } catch (e) {
                console.log("فشل إضافة روابط الصور الى قاعدة البيانات", e);
            }
            console.log("reached .next")
            props.next();
        }
    };


    const removeImage = async (id) => {
        const img = images.find(i => i.id === id);
        if (!img) return;

        if (img.src && img.src.startsWith("https://res.cloudinary.com")) {
            const image = await getIdBySecureUrl(img.src);
            const public_id = image.public_id;
            console.log(public_id);
            if (public_id) {
                try {
                    setDeleting(true);
                    const res = await fetch("/api/property/delete-image", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ public_id }),
                    });
                    const data = await res.json();
                    if (data.ok) {
                        const deletedImageFromDB = await deleteImageFromDB(public_id);
                        console.log(deletedImageFromDB);
                    }
                    console.log(" تم حذف الصورة من Cloudinary:", data);
                } catch (err) {
                    console.error(" خطأ أثناء حذف الصورة:", err);
                } finally {
                    setDeleting(false);
                }
            }
        }

        if (img?.preview) URL.revokeObjectURL(img.preview);
        setImages(prev => prev.filter(i => i.id !== id));
    };



    return <div>
        <div className="w-[400px] h-[300px] border-gray-500 bg-[#0f2638] rounded-[25px] border-[1px] mx-auto my-25 text-white ">
            <img src="/assets/icons/addimageicon/drag-and-drop.png" className="w-26 h-26 mx-auto mt-10" />
            <input id="imageupload" type="file" disabled={loading || LoadingImages} multiple accept="image/*" onChange={imageChangeHandler}
                className="w-[100%] h-[100%] hidden"
            />
            <label htmlFor="imageupload" className={`text-center font-bold mx-auto block mt-[10%] text-[16px] border-[1px] border-blue-900 bg-blue-900 hover:bg-[#240091] cursor-pointer py-[12px] w-[70%] rounded-[12px] ${(loading || LoadingImages) ? "cursor-not-allowed bg-gray-500 hover:bg-gray-500 hover:cursor-not-allowed" : ""}`}>اضغط لاختيار صور العقار</label>
        </div>

        {images.length > 0 && <div className="flex justify-center gap-4 flex-wrap px-20 py-20 bg-blue-200 mx-10 rounded-2xl mb-10">
            {images.map(
                (item) => {
                    return (<div key={item.id} className="relative">
                        <img src={item.preview || item.src} className="w-[300px]  relative p-5 bg-white rounded-2xl" />
                        {!loading && <img src="/assets/icons/exit/no.png" className="absolute top-1 right-1 w-8 h-8 cursor-pointer" onClick={() => { removeImage(item.id) }} />}
                    </div>)
                })
            }
            {Deleting && <p className="text-center my-4 block">جاري حذف الصورة...</p>}
        </div>}
        {error && <p className="text-red-500 text-center mb-10">{error}</p>}
        <button type='button' onClick={uploadImages} disabled={images.length === 0 || loading || uploaded} className={`text-white py-3 mb-16 px-8 rounded-[8px] ${(images.length > 0 && !loading && !uploaded) ? 'bg-sky-900  hover:bg-sky-700 cursor-pointer' : 'bg-gray-700 cursor-not-allowed'} transition-all duration-300 mx-auto text-[18px] font-bold block`}>
            رفع الصور</button>
        {loading && <p className="text-center mb-4 font-bold text-[#240091]">جاري رفع الصور...</p>}
        {loading && (
            <div className="w-[70%] mx-auto mb-4 ltr" dir="ltr">
                <div className="bg-gray-300 rounded h-3" dir="ltr">
                    <div className="bg-sky-600 h-3 rounded ltr" style={{ width: `${progress}%` }} dir="ltr" />
                </div>
                <p className="text-center mt-2">{progress}%</p>
            </div>
        )}
        <div className="w-full flex justify-around items-center mb-32 m-auto">
            <button type='button' onClick={() => { props.next(); }} disabled={uploaded} className={`text-white w-[100px] h-[51px] text-center rounded-lg transition-all duration-300 text-[18px] font-bold 
        ${(!uploaded && !loading) ? 'bg-sky-900 hover:bg-sky-700 cursor-pointer' : 'bg-gray-700 cursor-not-allowed'}`}>
                تخطي</button>

            <button type='button' onClick={() => { props.previous(); }} disabled={uploaded} className={`text-white w-[250px] h-[51px] text-center rounded-lg transition-all duration-300 text-[18px] font-bold 
        ${(!uploaded && !loading) ? 'bg-sky-900 hover:bg-sky-700 cursor-pointer' : 'bg-gray-700 cursor-not-allowed'}`}>
                العودة إلى الخطوة السابقة</button>
        </div>
        {LoadingImages && <Loading />}
    </div>
}
export default Images;