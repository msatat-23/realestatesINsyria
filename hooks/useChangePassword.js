"use client"
import { useReducer } from "react";
import { ChangePassword } from "@/serverrequests/change-password";


export const useChangePasswordForm = ({ onSuccess } = {}) => {
    const initialState = {
        values: {
            password: "",
        },
        errors: {
            password: null,
            passwordmatch: null,
        },
        server: null,
        passwordconfirmation: "",
        loading: false,
        showpassword: false,
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


    const submit = async (token) => {
        const requiredAndErrors =
            Object.values(state.values).every((val) => val !== "") &&
            Object.values(state.errors).every((err) => err === null);

        if (!requiredAndErrors) {
            dispatch({ type: "SET_SERVER_ERROR", value: "أكمل الحقول المطلوبة." });
            return;
        }
        dispatch({ type: "SET_LOADING", value: true });
        //TODO:send newpassword and token
        try {
            const res = await ChangePassword(state.values.password, token);
            const data = await res.data;
            if (!res.ok) {
                if (res.error === "TOKEN_INVALID") {
                    dispatch({ type: "SET_SERVER_ERROR", value: "رابط إعادة ضبط كلمة المرور غير صالح أو انتهت مدته!" });
                    return { ok: false, res };
                }
                else if (res.error === "TOKEN_EXPIRED") {
                    dispatch({ type: "SET_SERVER_ERROR", value: "للأسف انتهت صلاحية رابط إعادة ضبط كلمة المرور يرجى الطلب مرة أخرى!" });
                    return { ok: false, res };
                }
                else if (res.error === "UPDATE_PASSWORD_FAILED_FROM_SERVER") {
                    dispatch({ type: "SET_SERVER_ERROR", value: "خطأ في إعادة ضبط كلمة المرور يرجى المحاولة لاحقا!" });
                    return { ok: false, res };
                }
                else {
                    dispatch({ type: "SET_SERVER_ERROR", value: res.error || "خطأ في إعادة ضبط كلمة المرور يرجى المحاولة لاحقا!" });
                    return { ok: false, res };
                }
            }
            dispatch({ type: 'SET_SUCCESS', value: "تم تغيير كلمة المرور بنجاح ✅" });
            dispatch({ type: "SET_LOADING", value: false });
            return { ok: true, data: data };

        } catch (err) {
            dispatch({ type: "SET_SERVER_ERROR", value: "مشكلة في الشبكة!" });
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
