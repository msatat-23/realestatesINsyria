"use client"
import { useReducer } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Reset } from "@/serverrequests/request-reset-password";
export const useSendResetForm = ({ onSuccess } = {}) => {
    const initialState = {
        values: {
            email: "",
        },
        errors: {
            email: null,
        },
        server: null,
        loading: false,
        success: null
    };

    const reducerActions = (state, action) => {
        switch (action.type) {
            case "SET_FIELD":
                return { ...state, values: { ...state.values, [action.field]: action.value } };
            case "SET_ERROR":
                return { ...state, errors: { ...state.errors, [action.field]: action.value } };
            case "RESET_ERROR":
                return { ...state, errors: { ...state.errors, [action.field]: null } };
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
        console.log(state.values);
        dispatch({ type: "SET_LOADING", value: true });

        try {
            const res = await Reset(state.values);
            if (!res || !res.ok) {

                let message = "خطأ في إرسال بريد إعادة ضبط كلمة المرور!";
                if (res?.error === "EMAIL_NOT_FOUND") {
                    message = "البريد الالكتروني غير موجود!";
                }
                else if (res?.error === "server_error") {
                    message = "خطأ في الخادم. حاول لاحقًا.";
                }

                dispatch({ type: "SET_SERVER_ERROR", value: message });
                console.warn("Login failed:", res.error);
                return res;
            }


            console.log("login success:", res.data);
            dispatch({ type: "SET_SUCCESS", value: "تم إرسال رسالة إعادة ضبط كلمة المرور إلى بريدك الالكتروني ✅" });

            if (onSuccess) onSuccess(res.data);

            return res;
        } catch (err) {

            dispatch({ type: "SET_SERVER_ERROR", value: "مشكلة في الشبكة!" });
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
