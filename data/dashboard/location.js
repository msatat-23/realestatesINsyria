import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export const addGovernorate = async (name) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return { ok: false, error: "UNAUTHORIZED" };

    try {
        const newGov = await prisma.governorate.create({
            data: { name: name }
        });
        return { ok: true, data: newGov };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const deleteGovernorate = async (id) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    try {
        const deleteGov = await prisma.governorate.delete({
            where: { id: parseInt(id) }
        });
        return { ok: true, data: deleteGov };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const addCity = async (name, governorateId) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    try {
        const addedCity = await prisma.city.create({
            data: { name: name, governorateId: parseInt(governorateId) }
        });
        return { ok: true, data: addedCity };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const deleteCity = async (id) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    try {
        const deleteCity = await prisma.city.delete({
            where: { id: parseInt(id) }
        });
        return { ok: true, data: deleteCity };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const addRegion = async (name, cityId) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    try {
        const addRegion = await prisma.region.create({
            data: { name: name, cityId: parseInt(cityId) }
        });
        return { ok: true, data: addRegion };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const deleteRegion = async (id) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    try {
        const deleteRegion = await prisma.region.delete({
            where: { id: parseInt(id) }
        });
        return { ok: true, data: deleteRegion };
    } catch (e) {
        return { ok: false, error: e };
    }
};