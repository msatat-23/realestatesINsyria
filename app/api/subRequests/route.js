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
        where = { user: { username: { contains: search } } };
    }
    const skip = (page - 1) * 3;

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
            default: return;
        };
    };
    filterResult();

    try {
        const subRequests = await prisma.subscriptionRequest.findMany({
            include: {
                user: { select: { id: true, username: true, subscription: true } }
            }
            ,
            take: 3,
            orderBy: orderBy,
            skip: skip,
            where: where,
        });
        return new Response(JSON.stringify(subRequests), { status: 200, headers: { "Content-type": "application/json" } });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e }), { status: 500 });
    }
}