import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import SubscriptionRequestsClient from "@/components/dashboard-components/subscripiton-requests-client";
import { auth } from "@/auth";


const Subscriptions = async () => {
    const session = await auth();
    const role = session?.user?.role;

    const subscriptionRequests = await prisma.subscriptionRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, username: true, subscription: true } }
        }
    });


    return <div className={classes.page}>
        <SideBar role={role} />
        <SubscriptionRequestsClient subscriptionRequests={subscriptionRequests} />
    </div>
};
export default Subscriptions;