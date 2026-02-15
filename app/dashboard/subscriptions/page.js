import prisma from "@/lib/prisma";
import SubscriptionRequestsClient from "@/components/dashboard-components/subscripiton-requests-client";



const Subscriptions = async () => {


    const total = await prisma.subscriptionRequest.count();

    return <SubscriptionRequestsClient total={total} />

};
export default Subscriptions;