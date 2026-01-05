import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import ComplaintsClient from "@/components/dashboard-components/complaints-client";
import { auth } from "@/auth";


const Complaints = async () => {
    const session = await auth();
    const role = session?.user?.role;
    const complaints = await prisma.complaint.findMany({ orderBy: { createdAt: "desc" } });

    return <div className={classes.page}>
        <SideBar role={role} />
        <ComplaintsClient complaints={complaints} />
    </div>
};
export default Complaints;