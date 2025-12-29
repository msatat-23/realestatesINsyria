import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 600000,
});

export const runtime = "nodejs";

export const POST = async (req) => {
    console.log("📹 I AM IN SERVER POSTING VIDEO");
    try {
        const fd = await req.formData();
        const file = fd.get("file");
        const propertyId = fd.get("propertyId");

        if (!file || !file.stream)
            return NextResponse.json({ ok: false, error: "لا يوجد فيديو للرفع" }, { status: 400 });

        if (!propertyId)
            return NextResponse.json({ ok: false, error: "رقم العقار مفقود" }, { status: 400 });

        if (!file.type.startsWith("video/"))
            return NextResponse.json({ ok: false, error: "الملف ليس فيديو" }, { status: 400 });

        const folderpath = `property-video/${propertyId}`;


        const response = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folderpath,
                    resource_type: "video",
                    use_filename: true,
                    timeout: 600000,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );


            file.arrayBuffer().then((ab) => {
                const buffer = Buffer.from(ab);
                Readable.from(buffer).pipe(uploadStream);
            });
        });

        console.log("✅ تم رفع الفيديو بنجاح:", response.secure_url);

        return NextResponse.json({
            ok: true,
            message: "تم رفع الفيديو بنجاح!",
            secure_url: response.secure_url,
            public_id: response.public_id,
            response: response
        });
    } catch (e) {
        console.error(" خطأ أثناء الرفع:", e);
        return NextResponse.json(
            { ok: false, error: "فشل الرفع", details: e.message || e.toString() },
            { status: 500 }
        );
    }
};
