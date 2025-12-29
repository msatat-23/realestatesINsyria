export const reverseToArabic = (arr) => {
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
};




////////////////////////////////////////NEEDS FIXING////////////////////////////////////////////
// export const reverseToEnglish = (arr,isdirection) => {
//   const reversedTranslationMap = {
//     "شرقي": "EAST",
//     "غربي": "WEST",
//     "جنوبي": "SOUTH",
//     "شمالي": "NORTH",
//     "بيع": "SALE",
//     "إيجار": "RENT",
//     "رهن": "MORTGAGE",
//     "شقة": "APARTMENT",
//     "فيلا": "VILLA",
//     "مكتب": "OFFICE",
//     "محل": "SHOP",
//     "مكتب تجاري": "COMMERCIALOFFICE",
//     "مول": "MALL",
//     "فندق": "HOTEL",
//     "مصنع": "FACTORY",
//     "مستودع": "WAREHOUSE",
//     "أرض_فارغة": "EMPTYLAND",
//     "أرض_زراعية": "AGRICULTURAL",
//     "مبنى": "BUILDING",
//     "شاليه": "CHALET",
//     "استوديو": "STUDIO",
//     "بيت_عربي": "ARABICHOUSE",
//     "مزرعة": "FARM",
//     "منتجع": "RESORT",
//     "عيادة": "CLINIC",
//     "معرض": "EXHIBITION",
//     "موقف_سيارات": "PARKING",
//     "مجاني": "FREE",
//     "مميز": "PREMIUM",
//     "حصري": "EXCLUSIVE",
//     "أدمن": "ADMIN",
//     "مستخدم_عادي": "USER",
//     "مقبول": "ACCEPTED",
//     "مرفوض": "REJECTED",
//     "قيد_المراجعة": "PENDING",
//     "بحاجة_إكساء": "NEEDSRENOVATION",
//     "عادي": "NORMAL",
//     "سوبر": "SUPER",
//     "سوبر_ديلوكس": "SUPERDELUXE",
//     "شكوى": "COMPLAINT",
//     "استفسار": "INQUIRY"
// };
//     return arr.map((item) => {
//         const itemarr =isdirection? item.split('_'):item;
//         return itemarr.map((word) => translationMap[word]).join('_');
//     });
// };

