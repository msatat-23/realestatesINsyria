import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Readable } from 'stream';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const runtime = "nodejs";
export const POST = async (req) => {
    const fd = await req.formData();
    const file = fd.get('file');
    const id = fd.get('id');
    const folderpath = `user-images/${id}`;
    try {
        const { resources } = await cloudinary.api.resources({
            type: 'upload',
            prefix: folderpath,
            resource_type: 'image',
        });
        if (resources.length > 0) {
            const publicids = resources.map(r => r.public_id);
            await cloudinary.api.delete_resources(publicids);
            console.log('تم حذف الصور القديمة للمستخدم');
        }
        const result = await new Promise(
            (resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: folderpath,
                    resource_type: "image",
                    use_filename: true
                },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                const nodeStream = Readable.fromWeb(file.stream());
                nodeStream.pipe(stream);
            }
        );

        return NextResponse.json({
            message: 'تم رفع صورة المستخدم بنجاح',
            url: result.secure_url,
            public_id: result.public_id
        });
    }
    catch (e) {
        console.error(' خطأ أثناء الرفع:', e);
        return NextResponse.json(
            { error: 'فشل الرفع', details: e.message },
            { status: 500 }
        );
    }
};