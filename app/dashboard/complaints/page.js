import prisma from "@/lib/prisma";
import ComplaintsClient from "@/components/dashboard-components/complaints-client";


const Complaints = async () => {


    const total = await prisma.complaint.count();

    return <ComplaintsClient total={total} />
};
export default Complaints;