"use client"
import { useReducer } from "react";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Login } from "@/serverrequests/login";
import { AuthError } from "next-auth";
export const useLogInForm = ({ onSuccess } = {}) => {
    const initialState = {
        values: {
            email: "",
            password: "",
        },
        errors: {
            email: null,
            password: null,
            code: null
        },
        showcode: false,
        code: null,
        server: null,
        loading: false,
        showpassword: false,
        success: null
    };

    const reducerActions = (state, action) => {
        switch (action.type) {
            case "SET_FIELD":
                return { ...state, values: { ...state.values, [action.field]: action.value } };
            case "SET_CODE":
                return { ...state, code: action.value };
            case "RESET_CODE":
                return { ...state, code: null };
            case "SET_SHOWCODE":
                return { ...state, showcode: true };
            case "SET_ERROR":
                return { ...state, errors: { ...state.errors, [action.field]: action.value } };
            case "RESET_ERROR":
                return { ...state, errors: { ...state.errors, [action.field]: null } };
            case "SHOWPASSWORD":
                return { ...state, showpassword: !state.showpassword };
            case "SET_LOADING":
                return { ...state, loading: action.value };
            case "SET_SUCCESS":
                return { ...state, success: action.value }
            case "RESET_SUCCESS":
                return { ...state, success: null };
            case "SET_SERVER_ERROR":
                return { ...state, server: action.value };
            case "RESET_SERVER_ERROR":
                return { ...state, server: null };
            case "RESET":
                return initialState;
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducerActions, initialState);


    const submit = async () => {
        const requiredAndErrors =
            Object.values(state.values).every((val) => val !== "") &&
            Object.values(state.errors).every((err) => err === null);

        if (!requiredAndErrors) {
            dispatch({ type: "SET_SERVER_ERROR", value: "أكمل الحقول المطلوبة." });
            return { ok: false, error: "missing_fields" };
        }

        dispatch({ type: "SET_LOADING", value: true });

        try {
            const res = await Login({ ...state.values, ...(state.showcode ? { code: state.code } : {}) });


            if (!res || !res.ok) {

                let message = "حدث خطأ في تسجيل الدخول!";
                if (res?.error === "credentials") {
                    message = "البريد الالكتروني أو كلمة المرور خاطئة!";
                }
                else if (res?.error === "INVALID_2FA") {
                    message = "رمز التحقق خاطئ أو منتهي الصلاحية.";
                }
                else if (res?.error === "verifyEmail") {
                    message = "الحساب بحاجة إلى تأكيد تم إرسال بريد الكتروني لتأكيد الحساب.";
                }
                else if (res?.error === "server_error") {
                    message = "خطأ في الخادم. حاول لاحقًا.";
                }
                console.log(message);
                dispatch({ type: "RESET_SUCCESS" });
                dispatch({ type: "SET_SERVER_ERROR", value: message });
                console.warn("Login failed:", res.error);
                return res;
            }
            if (res.ok && res.twofactor) {
                dispatch({ type: "SET_SUCCESS", value: "رمز التحقق تم إرساله إلى بريدك الإلكتروني." });
                return res;
            }

            console.log("login success:", res.data);
            dispatch({ type: "SET_SUCCESS", value: "تم تسجيل الدخول بنجاح ✔️" });

            if (onSuccess) onSuccess(res.data);
            window.location.href = '/';
            return res;
        } catch (err) {

            dispatch({ type: "SET_SERVER_ERROR", value: "مشكلة في الشبكة" });
            console.error("Login submit error:", err);
            return { ok: false, error: err };
        } finally {
            dispatch({ type: "SET_LOADING", value: false });
        }
    };



    return {
        state, dispatch, submit,
    };
};
