import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import SideBar from "@/components/dashboard-components/sidebar";
import { redirect } from "next/navigation";
import UsersClient from "@/components/dashboard-components/users";


const Users = async () => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") {
        redirect("/");
    };

    const isSuperAdmin = role === "SUPERADMIN";


    const total = await prisma.user.count();

    return <div className={classes.dashboard}>
        <SideBar role={role} />
        <UsersClient total={total} />
    </div>
};
export default Users;