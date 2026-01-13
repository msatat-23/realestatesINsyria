import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import ComplaintsClient from "@/components/dashboard-components/complaints-client";
import { auth } from "@/auth";


const Complaints = async () => {
    const session = await auth();
    const role = session?.user?.role;

    const total = await prisma.complaint.count();

    return <div className={classes.page}>
        <SideBar role={role} />
        <ComplaintsClient total={total} />
    </div>
};
export default Complaints;