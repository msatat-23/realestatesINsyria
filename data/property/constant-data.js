import prisma from "@/lib/prisma";
import { PropertyType, Purpose, Direction, Subscription, State, Status } from "@prisma/client";

const reverseToArabic = (arr) => {
    const translationMap = {
        "EAST": "شرقي",
        "WEST": "غربي",
        "SOUTH": "جنوبي",
        "NORTH": "شمالي",
        "SALE": "بيع",
        "RENT": "إيجار",
        "MORTGAGE": "رهن",
        "APARTMENT": "شقة",
        "VILLA": "فيلا",
        "OFFICE": "مكتب",
        "SHOP": "محل_تجاري",
        "COMMERCIALOFFICE": "مكتب تجاري",
        "MALL": "مول",
        "HOTEL": "فندق",
        "FACTORY": "مصنع",
        "WAREHOUSE": "مستودع",
        "EMPTYLAND": "أرض_فارغة",
        "AGRICULTURAL": "أرض_زراعية",
        "BUILDING": "مبنى",
        "CHALET": "شاليه",
        "STUDIO": "استوديو",
        "ARABICHOUSE": "بيت_عربي",
        "FARM": "مزرعة",
        "RESORT": "منتجع",
        "CLINIC": "عيادة",
        "EXHIBITION": "معرض",
        "PARKING": "موقف_سيارات",
        "FREE": "مجاني",
        "PREMIUM": "مميز",
        "EXCLUSIVE": "حصري",
        "ADMIN": "أدمن",
        "USER": "مستخدم_عادي",
        "ACCEPTED": "مقبول",
        "REJECTED": "مرفوض",
        "PENDING": "قيد_المراجعة",
        "NEEDSRENOVATION": "بحاجة_إكساء",
        "NORMAL": "عادي",
        "SUPER": "سوبر",
        "SUPERDELUXE": "سوبر_ديلوكس",
        "COMPLAINT": "شكوى",
        "INQUIRY": "استفسار",
    };
    return arr.map((item) => {
        const itemarr = item.split('_');
        return itemarr.map((word) => translationMap[word]).join('_');
    });
}

export const getPropertyTypes = () => {
    const types = Object.values(PropertyType);
    const reversed = reverseToArabic(types);
    return reversed;
};
export const getPropertyPurposes = () => {
    const purposes = Object.values(Purpose);
    const reversed = reverseToArabic(purposes);
    return reversed;
};
export const getPropertyDirections = () => {
    const directions = Object.values(Direction);
    const reversed = reverseToArabic(directions);
    return reversed;
};
export const getPropertySubscriptions = () => {
    const subscriptions = Object.values(Subscription);
    const reversed = reverseToArabic(subscriptions);
    return reversed;
};
export const getPropertyStates = () => {
    const states = Object.values(State);
    const reversed = reverseToArabic(states);
    return reversed;
};
export const getPropertyStatuses = () => {
    const statuses = Object.values(Status);
    const reversed = reverseToArabic(statuses);
    return reversed;
};
export const getAllGovernorates = async () => {
    try {
        const governorates = await prisma.governorate.findMany();
        return governorates;
    } catch (e) {
        console.log("Error fetching governorates ", e);
    }
};
export const getGovernorateCities = async (id) => {
    try {
        const cities = await prisma.city.findMany({
            where: {
                governorateId: parseInt(id)
            }
        });
        return cities;
    } catch (e) {
        console.log("Error fetching cities ", e);
    }
};
export const getCityRegions = async (id) => {
    try {
        const regions = await prisma.region.findMany({
            where: {
                cityId: parseInt(id)
            }
        });
        return regions;
    } catch (e) {
        console.log("Error fetching regions ", e);
    }
};
export const getAllAmenities = async () => {
    try {
        const amenities = await prisma.amenity.findMany();
        return amenities;
    } catch (e) {
        console.log("Error fetching amenities ", e);
    }
};
export const getRegionByRegionId = async (id) => {
    try {
        const region = await prisma.region.findUnique({
            where: {
                id: id
            }
        });
        return region;
    } catch (e) {
        console.log("فشل في جلب المنطقة : ", e);
        return { ok: false, error: e };
    }
}
export const getCityByRegionId = async (regionId) => {
    try {
        const city = await prisma.region.findUnique({
            where: { id: regionId },
            select: {
                city: true
            }
        });
        return city;
    } catch (e) {
        console.log("فشل في جلب مدينة المنطقة : ", e);
        return { ok: false, error: e };
    }
};
export const getGovernorateByCityId = async (cityId) => {
    try {
        const governorate = await prisma.city.findUnique({
            where: { id: cityId },
            select: {
                governorate: true
            }
        });
        return governorate;
    } catch (e) {
        console.log("فشل في جلب محافظة المدينة : ", e);
        return { ok: false, error: e };
    }
};
