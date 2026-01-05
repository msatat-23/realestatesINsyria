import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import PropertiesClient from "@/components/dashboard-components/properties";
import { auth } from "@/auth";



const Properties = async () => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") {
        redirect("/");
    };

    const properties = await prisma.property.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
            region: { include: { city: true } },
            images: true
        }
    });

    return <div className={classes.page}>
        <SideBar role={role} />
        <PropertiesClient properties={JSON.stringify(properties)} />
    </div>
};
export default Properties;