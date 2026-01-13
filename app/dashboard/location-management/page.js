import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import LocationManagementClient from "@/components/dashboard-components/location-management-client";
import { auth } from "@/auth";


const LocationManagement = async ({ searchParams }) => {
    const session = await auth();
    const role = session?.user?.role;

    const params = await searchParams;
    const page = params?.page || 1;
    const key = params?.key || "governorate";
    const search = params?.search || "";

    const skip = (Number(page) - 1) * 15;

    console.log("PAGE::::" + page);
    console.log("SKIP::::" + skip);
    console.log("KEY::::" + key);

    const governorateTake = key === "governorate" ? 15 : 0;
    const cityTake = key === "city" ? 15 : 0;
    const regionTake = key === "region" ? 15 : 0;

    const govCountWhere = key === "governorate" ? {} : { id: 100000000 };
    const cityCountWhere = key === "city" ? {} : { id: 100000000 };
    const regionCountWhere = key === "region" ? {} : { id: 100000000 };

    const govSkip = key === "governorate" ? skip : 0;
    const citySkip = key === "city" ? skip : 0;
    const regionSkip = key === "region" ? skip : 0;

    const where = (search && search !== "") ? { name: { contains: search } } : {};

    const locations = await prisma.$transaction([
        prisma.governorate.findMany({
            orderBy: { createdAt: "asc" },
            include: { _count: { select: { cities: true } } },
            take: governorateTake,
            skip: govSkip,
            where: where
        }),
        prisma.governorate.count({ where: govCountWhere }),
        prisma.city.findMany({
            orderBy: { regions: { _count: "desc" } },
            include: {
                _count: { select: { regions: true } },
                governorate: { select: { name: true } }
            },
            take: cityTake,
            skip: citySkip,
            where: where
        }),
        prisma.city.count({ where: cityCountWhere }),
        prisma.region.findMany({
            orderBy: { createdAt: "asc" },
            include: { city: { select: { name: true, governorate: { select: { name: true } } } } },
            take: regionTake,
            skip: regionSkip,
            where: where
        }),
        prisma.region.count({ where: regionCountWhere })
    ]);


    return <div className={classes.page}>
        <SideBar role={role} />
        <LocationManagementClient locations={locations} />
    </div>
};
export default LocationManagement;