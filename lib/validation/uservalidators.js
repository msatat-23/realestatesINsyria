
export const isEnglish = (name) => /^[a-zA-Z ]{2,}$/.test(name);
export const isArabic = (name) => /^[\u0600-\u06FF]{2,}$/.test(name);
export const englishAndArabic = (name) => /[a-zA-Z]+/.test(name) && /[\u0600-\u06FF]+/.test(name);
export const hasSymbols = (name) => /.*[^a-zA-Z0-9\u0600-\u06FF].*/.test(name);
export const hasNumbers = (text) => /\d/.test(text);
export const onlyNumbers = (text) => /^\d+$/.test(text);
export const lessThanTwo = (text) => /^.$/.test(text);

export const validateFirstName = (name) => {
    if (!name) {
        return 'الاسم الأول مطلوب!'
    }
    if (hasNumbers(name)) {
        return 'الاسم الأول لا يجب أن يحتوي على أرقام ولا رموز!'
    }
    return null;
};
export const validateLastName = (name) => {
    if (!name) {
        return 'الاسم الأخير مطلوب!'
    }
    if (hasNumbers(name)) {
        return 'الاسم الأخير لا يجب أن يحتوي على أرقام ولا رموز!'
    }
    return null;
};

export const validateName = (first, last, lastNotSet) => {
    if (!first && lastNotSet) {
        return 'الاسم الأول مطلوب!'
    }
    if (!last) {
        return 'الاسم الأخير مطلوب!'
    }
    if (!first && !lastNotSet) {
        return 'الاسم الأول والاسم الأخير مطلوبان!'
    }
    if (hasNumbers(first) || hasNumbers(last)) {
        return 'الاسم الأول والأسم الأخير لايجب أن يحتويان على أرقام!'
    }
    if (hasSymbols(first) || hasSymbols(last)) {
        return 'الاسم الأول والأسم الأخير لايجب أن يحتويان على رموز!'
    }
    if (lessThanTwo(first) || lessThanTwo(last)) {
        return 'الاسم الأول والأسم الأخير يجب أن يحتويان على حرفان أو أكثر'
    }
    if (!((isEnglish(first) && isEnglish(last)) || (isArabic(first) && isArabic(last)))) {
        return 'الاسم الأول والأسم الأخير يجب أن يكونان بنفس اللغة!'
    }
    return null;
}
export const validateUserName = (name) => {
    if (!name) {
        return "اسم المستخدم مطلوب!"
    }
    if (englishAndArabic(name)) {
        return "يجب استخدام نفس اللغة لاسم المستخدم!"
    }
    if (onlyNumbers(name)) {
        return "اسم المستخدم لايجب أن يكون فقط أرقام"
    }
    return null;
}

export const validatePhone = (phone) => {
    const phoneReg = /^(09|\+?963\s?9)\d{8}$/;
    if (!phone) {
        return 'رقم الهاتف مطلوب!'
    }
    if (!phoneReg.test(phone)) {
        return "إدخال خاطئ لرقم الهاتف!"
    }
    return null;
}

export const validadteEmail = (email) => {
    const emailReg = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._%+-]+@(?!(?:-|\.)|.*(?:-|\.)$)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if (!email) {
        return 'البريد الالكتروني مطلوب!'
    }
    if (!emailReg.test(email)) {
        return "بريد الكتروني غير صالح!"
    }
    return null;
}

export const passwordValidation = (pass) => {
    const passReg = /^\S{6,32}$/;
    if (!pass) {
        return 'كلمة المرور مطلوبة!'
    }
    if (!passReg.test(pass)) {
        return "كلمة المرور يجب أن تكون بين 6 و32 محرف بدون فراغات!"
    }
    return null;
}

export const passwordMatchValidation = (pass, confirm) => {
    if (pass !== confirm) {
        return "كلمة المرور وتأكيدها غير متطابقين!"
    }
    return null;
}

export const codevalidation = (code) => {
    const codeReg = /^\d{6}$/;
    if (!code) {
        return "الرجاء إدخال رمز التحقق!";
    }
    if (!codeReg.test(code)) {
        return "رمز التحقق يجب أن يكون مكون من 6 أرقام!";
    }
    return null;
}