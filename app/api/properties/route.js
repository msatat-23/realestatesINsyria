import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export async function GET(req) {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") {
        return new Response(JSON.stringify({ ok: false, error: "UNAUTHORIZED" }), {
            status: 401
        });
    }


    let page = Number(req.nextUrl.searchParams.get("page"));
    let where = {};
    const search = req.nextUrl.searchParams.get("search");
    const filter = req.nextUrl.searchParams.get("filter");

    if (search && search !== "") {
        where.title = { contains: search }
    }

    const skip = (page - 1) * 15;

    console.log(page);
    console.log(search);
    console.log(filter)

    try {
        const properties = await prisma.property.findMany({
            orderBy: { updatedAt: filter.toString() },
            include: {
                region: { include: { city: true } },
                images: true
            },
            take: 15,
            skip: skip,
            where: where
        });
        return new Response(JSON.stringify(properties), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e }), { status: 500 })
    }
}