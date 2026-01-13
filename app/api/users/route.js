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
        where.username = { contains: search }
    }
    const skip = (page - 1) * 9;

    console.log(page);
    console.log(search);
    console.log(filter)
    let orderBy = {};
    const filterResult = () => {
        switch (filter) {
            case "desc":
                orderBy = { createdAt: "desc" };
                return;
            case "asc":
                orderBy = { createdAt: "asc" };
                return;
            case "propCountDesc":
                orderBy = { properties: { _count: "desc" } };
                return;
            case "propCountAsc":
                orderBy = { properties: { _count: "asc" } };
                return;
            default: return;
        };
    };
    filterResult();

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                confirmedByAdmin: true,
                createdAt: true,
                _count: { select: { properties: true } }
            },
            take: 9,
            orderBy: orderBy,
            skip: skip,
            where: where
        });
        return new Response(JSON.stringify(users), { status: 200, headers: { "Content-type": "application/json" } });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e }), { status: 500 });
    }
}