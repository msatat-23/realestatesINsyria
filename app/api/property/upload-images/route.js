import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 600000
});

export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const form = await req.formData();
        const file = form.get('file');
        const propertyId = form.get('propertyId');

        if (!file || !file.stream)
            return NextResponse.json({ error: 'لا توجد صورة' }, { status: 400 });
        if (!propertyId)
            return NextResponse.json({ error: 'رقم العقار مفقود' }, { status: 400 });
        if (!file.type.startsWith('image/'))
            return NextResponse.json({ error: 'الملف ليس صورة' }, { status: 400 });


        const folderPath = `property-images/${propertyId}`;


        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folderPath,
                    resource_type: 'image',
                    use_filename: true,
                    timeout: 600000
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            const nodeStream = Readable.fromWeb(file.stream());
            nodeStream.pipe(uploadStream);
        });

        return NextResponse.json({
            message: 'تم رفع الصورة بنجاح ',
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (err) {
        console.error(' خطأ أثناء الرفع:', err);
        return NextResponse.json(
            { error: 'فشل الرفع', details: err.message },
            { status: 500 }
        );
    }
}
