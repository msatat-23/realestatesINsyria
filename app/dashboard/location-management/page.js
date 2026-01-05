import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import LocationManagementClient from "@/components/dashboard-components/location-management-client";
import { auth } from "@/auth";


const LocationManagement = async () => {
    const session = await auth();
    const role = session?.user?.role;

    const locations = await prisma.$transaction([
        prisma.governorate.findMany({ orderBy: { createdAt: "asc" }, include: { _count: { select: { cities: true } } } }),
        prisma.governorate.count(),
        prisma.city.findMany({ orderBy: { regions: { _count: "desc" } }, include: { _count: { select: { regions: true } }, governorate: { select: { name: true } } } }),
        prisma.city.count(),
        prisma.region.findMany({ orderBy: { createdAt: "asc" }, include: { city: { select: { name: true, governorate: { select: { name: true } } } } } }),
        prisma.region.count()
    ]);


    return <div className={classes.page}>
        <SideBar role={role} />
        <LocationManagementClient locations={locations} />
    </div>
};
export default LocationManagement;