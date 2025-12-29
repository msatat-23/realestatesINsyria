import Navbar from "@/components/navbar/navbar";
import Search from "@/components/search/search";
import SearchFilter from "@/components/searchfilter/searchfilter";
import Footer from "@/components/footer/footer";
import prisma from "@/lib/prisma";
import Property from "@/components/property/property";



const reversedTranslationMap = {
    "شرقي": "EAST",
    "غربي": "WEST",
    "جنوبي": "SOUTH",
    "شمالي": "NORTH",
    "بيع": "SALE",
    "آجار": "RENT",
    "رهن": "MORTGAGE",
    "شقة": "APARTMENT",
    "فيلا": "VILLA",
    "مكتب": "OFFICE",
    "محل_تجاري": "SHOP",
    "مكتب_تجاري": "COMMERCIALOFFICE",
    "مول": "MALL",
    "فندق": "HOTEL",
    "مصنع": "FACTORY",
    "مستودع": "WAREHOUSE",
    "أرض_فارغة": "EMPTYLAND",
    "أرض_زراعية": "AGRICULTURAL",
    "مبنى": "BUILDING",
    "شاليه": "CHALET",
    "استوديو": "STUDIO",
    "بيت_عربي": "ARABICHOUSE",
    "مزرعة": "FARM",
    "منتجع": "RESORT",
    "عيادة": "CLINIC",
    "معرض": "EXHIBITION",
    "موقف_سيارات": "PARKING",
    "مجاني": "FREE",
    "مميز": "PREMIUM",
    "حصري": "EXCLUSIVE",
    "أدمن": "ADMIN",
    "مستخدم_عادي": "USER",
    "مقبول": "ACCEPTED",
    "مرفوض": "REJECTED",
    "قيد_المراجعة": "PENDING",
    "بحاجة_إكساء": "NEEDSRENOVATION",
    "عادي": "NORMAL",
    "سوبر": "SUPER",
    "سوبر_ديلوكس": "SUPERDELUXE",
    "شكوى": "COMPLAINT",
    "استفسار": "INQUIRY"
};
const reversedTypes = {
    "شقة": "APARTMENT",
    "فيلا": "VILLA",
    "مكتب": "OFFICE",
    "محل_تجاري": "SHOP",
    "مكتب_تجاري": "COMMERCIALOFFICE",
    "مول": "MALL",
    "فندق": "HOTEL",
    "مصنع": "FACTORY",
    "مستودع": "WAREHOUSE",
    "أرض_فارغة": "EMPTYLAND",
    "أرض_زراعية": "AGRICULTURAL",
    "مبنى": "BUILDING",
    "شاليه": "CHALET",
    "استوديو": "STUDIO",
    "بيت_عربي": "ARABICHOUSE",
    "مزرعة": "FARM",
    "منتجع": "RESORT",
    "عيادة": "CLINIC",
    "معرض": "EXHIBITION",
    "موقف_سيارات": "PARKING",
};
const governorates = await prisma.governorate.findMany({ select: { id: true, name: true } });
const cities = await prisma.city.findMany({ select: { id: true, name: true } });
const ignoredWords = ['في', 'من', 'ب'];
const SearchPage = async ({ searchParams }) => {
    let params = await searchParams;
    params = Object.fromEntries(
        Object.entries(params).map(([key, value]) => {
            if (value === "undefined" || value === "null") {
                return [key, null];
            }
            return [key, value]
        })
    );
    const { q, purpose, minprice, maxprice, governorate, city, region, type, minarea, maxarea, minrooms, maxrooms, selected } = params;
    console.log(params);
    const words = q ? q.split(' ').filter(item => !ignoredWords.includes(item)) : [];
    console.log(words);

    const where = {};
    const orderBy = [];
    if (q) {
        let types = [];
        let searchgovernorates = [];
        for (const word of words) {
            const typeitems = Object.keys(reversedTypes).filter(key => key.includes(word));
            const reversedTypesItems = typeitems.map(item => reversedTypes[item]);
            const governoaretsitems = governorates.filter(item => item.name == word);
            types = [...types, ...reversedTypesItems];
            searchgovernorates = [...searchgovernorates, ...governoaretsitems];
        }
        console.log(types);
        console.log(searchgovernorates);
        where.OR = [];
        where.OR.push({
            AND: words.map(word => (
                { title: { contains: word, mode: "insensitive" } }
            ))
        });
        where.OR.push({
            AND: words.map(word => (
                { description: { contains: word, mode: "insensitive" } }
            ))
        });

        if (searchgovernorates.length > 0) {
            console.log(searchgovernorates[0].name);
            where.OR.push({ region: { city: { governorate: { name: searchgovernorates[0].name } } } });
        }
        if (types.length > 0) {
            where.OR.push({ propertyType: types[0] });
        }

    }
    if (purpose) {
        where.purpose = reversedTranslationMap[purpose]
    }
    if (minrooms) {
        where.rooms = { ...where.rooms, gte: parseInt(minrooms) };
    }
    if (maxrooms) {
        where.rooms = { ...where.rooms, lte: parseInt(maxrooms) };
    }
    if (minprice) {
        where.price = { ...where.price, gte: parseInt(minprice) };
    }
    if (maxprice) {
        where.price = { ...where.price, lte: parseInt(maxprice) };
    }
    if (governorate) {
        where.region = { city: { governorate: { name: governorate } } };
        if (city) {
            where.region.city.name = city;
        }
        if (region) {
            where.region.name = region;
        }
    }
    if (type) {
        where.propertyType = reversedTranslationMap[type];
    }
    if (minarea) {
        where.area = { ...where.area, gte: parseInt(minarea) };
    }
    if (maxarea) {
        where.area = { ...where.area, lte: parseInt(maxarea) };
    }
    console.log(where);
    const properties = await prisma.property.findMany(
        {
            where,
            select: {
                id: true,
                title: true,
                description: true,
                purpose: true,
                propertyType: true,
                price: true,
                area: true,
                region: { select: { city: { select: { name: true } }, name: true } },
                subscription: true,
                createdAt: true
            },

        }
    );
    console.log(properties);

    return <div>
        <Navbar mainpage={false} />
        <Search />
        <SearchFilter selected={selected} />
        <div className="flex justify-center gap-x-12 gap-y-12 w-[100%] my-12 flex-wrap">
            {properties.map(property => <Property key={property.id}{...property} />)}
        </div>
        <Footer />
    </div>
}
export default SearchPage;




















