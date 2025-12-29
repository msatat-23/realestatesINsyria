import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const GET = async (req, { params }) => {
    try {
        console.log("IAM IN SERVER FETCHING IMAGES");
        const { id } = await params;
        const foldername = `property-images/${id}`;
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: foldername,
            max_results: 100
        });
        const urls = result.resources.map(img => img.secure_url);
        return Response.json({ ok: true, images: urls });
    } catch (e) {
        return Response.json({ ok: false, error: "حدث خطأ أثناء جلب الصور" }, { status: 500 });
    }
}