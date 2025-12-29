

export const validateTitle = (text) => {
    const titleReg = /^[a-zA-Z\u0600-\u06FF0-9\s]{3,}$/;
    const validatetitle = titleReg.test(text);
    if (validatetitle) return true;
    else return 'إدخال خاطئ لعنوان العقار!';
};
export const validateDescription = (text) => {
    const descReg = /^[\s\S]+$/;
    const validatedescription = descReg.test(text);
    if (validatedescription) return true;
    else return 'إدخال خاطئ لوصف العقار!';
};
export const validateStreet = (text) => {
    const streetReg = /^[\u0600-\u06FF\s]{3,}$/;
    const validatestreet = streetReg.test(text);
    if (validatestreet) return true;
    else return 'إدخال خاطئ للشارع!';
};
export const validatePrice = (text) => {
    const priceReg = /^[0-9]+$/;
    const validateprice = priceReg.test(text);
    if (validateprice) return true;
    else return 'إدخال خاطئ للسعر!';
};
export const validateRooms = (text) => {
    const roomsReg = /^[0-9]+$/;
    const validaterooms = roomsReg.test(text);
    if (validaterooms) return true;
    else return 'إدخال خاطئ لعدد الغرف!';
};
export const validateArea = (text) => {
    const areaReg = /^[0-9]+$/;
    const validatearea = areaReg.test(text);
    if (validatearea) return true;
    else return 'إدخال خاطئ للمساحة!';
};
export const validateFloor = (text) => {
    const floorReg = /^[0-9\u0600-\u06FF\s]+$/;
    const validatefloor = floorReg.test(text);
    if (validatefloor) return true;
    else return 'إدخال خاطئ للطابق!';
};
export const validateContact = (text) => {
    const floorReg = /^[0-9\u0600-\u06FFa-zA-Z@\s\.+-]+$/;
    const validatefloor = floorReg.test(text);
    if (validatefloor) return true;
    else return 'إدخال خاطئ لمعلومات الاتصال!';
};