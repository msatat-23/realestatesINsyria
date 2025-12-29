import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export const fetchMyPlan = async () => {
    const session = await auth();
    const id = session?.user?.id;
    
    try {
        const myplan = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                subscription: true
            }
        });
        console.log(myplan);
        return { ok: true, myplan: myplan.subscription };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};

export const updateMyPlanRequest = async (formData) => {
    const session = await auth();
    const id = session?.user?.id;

    const subtype = formData.get("subtype");
    const image = formData.get("image");

    try {
        const updateMyPlan = await prisma.subscriptionRequest.create({
            data: {
                userId: parseInt(id),
                subtype: subtype,
                image: image
            }
        });
        console.log(updateMyPlan);
        return { ok: true, updatePlan: updateMyPlan.subscription };
    } catch (e) {
        console.log(e);
        return { ok: false, error: e.message };
    }
};