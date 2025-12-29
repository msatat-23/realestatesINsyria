"use client"
import { useReducer } from "react";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const useSignUpForm = ({ onSuccess } = {}) => {
    const initialState = {
        values: {
            firstName: "",
            lastName: "",
            username: "",
            phone: "",
            email: "",
            password: "",
        },
        errors: {
            name: null,
            username: null,
            phone: null,
            email: null,
            password: null,
            passwordmatch: null,

        },
        server: null,
        passwordconfirmation: "",
        loading: false,
        showpassword: false,
        agreeTerms: false,
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
            case "SHOWPASSWORD":
                return { ...state, showpassword: !state.showpassword };
            case "SET_LOADING":
                return { ...state, loading: action.value };
            case "SET_AGREE":
                return { ...state, agreeTerms: action.value };
            case "SET_SUCCESS":
                return { ...state, success: action.value }
            case "RESET_SUCCESS":
                return { ...state, success: null }
            case "UPDATE_PASSWORD_CONFIRMATION":
                return { ...state, passwordconfirmation: action.value };
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
            Object.values(state.errors).every((err) => err === null) &&
            state.agreeTerms;

        if (!requiredAndErrors) {
            dispatch({ type: "SET_SERVER_ERROR", value: "أكمل الحقول المطلوبة." });
            return;
        }
        dispatch({ type: "SET_LOADING", value: true });

        try {
            const res = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(state.values)
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 400) {
                    dispatch({ type: "SET_SERVER_ERROR", value: "البريد الالكتروني موجود مسبقا!" });
                }
                else if (res.status === 599) {
                    dispatch({ type: "SET_SERVER_ERROR", value: "رقم الهاتف الذي أدخلته موجود مسبقا!" });
                }
                else { dispatch({ type: "SET_SERVER_ERROR", value: res.error || "خطأ في التسجيل!" }); }
                return { ok: false, res };
            }
            dispatch({ type: 'SET_SUCCESS', value: "شكراً لتسجيلك! لقد أرسلنا لك رابط تأكيد عبر البريد الإلكتروني، الرجاء التحقق من صندوق الوارد." });
            if (onSuccess) onSuccess(res.data);

            dispatch({ type: "SET_LOADING", value: false });
            return { ok: true, data: data };
        } catch (err) {
            dispatch({ type: "SET_SERVER_ERROR", value: "مشكلة في الشبكة" });
            console.error(err);
            return { ok: false, error: err };
        } finally {
            dispatch({ type: "SET_LOADING", value: false });
        }
    };


    return {
        state, dispatch, submit,
    };
};
