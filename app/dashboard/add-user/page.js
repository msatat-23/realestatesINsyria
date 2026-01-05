import classes from "./page.module.css";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SideBar from "@/components/dashboard-components/sidebar";
import SignUpClient from "@/components/dashboard-components/register-user-client";



const AddUser = async () => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role !== "SUPERADMIN") redirect("/dashboard");

    return <div className={classes.page}>
        <SideBar role={role} />
        <SignUpClient />
    </div>
};
export default AddUser;