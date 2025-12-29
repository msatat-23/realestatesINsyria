import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const DELETE = async (req) => {
    try {
        const { public_id } = await req.json();
        if (!public_id) {
            return NextResponse.json({ error: "لايوجد public id!" }, { status: 400 });
        }
        const res = await cloudinary.uploader.destroy(public_id, { resource_type: "video" });
        return NextResponse.json({ ok: true, response: res });
    }
    catch (e) {
        console.error(" خطأ أثناء حذف الفيديو:", error);
        return NextResponse.json({ error: "فشل حذف الفيديو" }, { status: 500 });
    }

}