import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import SubscriptionRequestsClient from "@/components/dashboard-components/subscripiton-requests-client";
import { auth } from "@/auth";


const Subscriptions = async () => {
    const session = await auth();
    const role = session?.user?.role;

    const total = await prisma.subscriptionRequest.count();

    return <div className={classes.page}>
        <SideBar role={role} />
        <SubscriptionRequestsClient total={total} />
    </div>
};
export default Subscriptions;