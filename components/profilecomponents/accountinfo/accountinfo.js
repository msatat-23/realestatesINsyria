"use client"
import classes from "./accountinfo.module.css";
import ReactDOM from "react-dom";
import { useRef, useReducer, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateUserName, validateFirstName, validateLastName, validatePhone } from "@/lib/validation/uservalidators";
import { updateImage, updateUserByUserId } from "@/app/profile/update-user";
import Loading from "@/components/loading/loading";
import Confirm from "@/components/confirmcomponent/confirm";
import { setinfo } from "@/store/userSlice";
const AccountInfo = () => {
    const imageInput = useRef();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [feedBackMounted, setFeedBackMounted] = useState(false);
    const [feedBackText, setFeedBackText] = useState("");
    const user = useSelector(state => state.user);
    const dispatchToRedux = useDispatch();
    const createdAt = new Date(user.createdAt).toLocaleDateString();

    const optimizeCloudinary = (url) => {
        if (url)
            return url.replace("/upload/", "/upload/f_auto,q_auto,w_900/");
        else return url;
    };

    const clickImageHandler = () => {
        imageInput.current.click();
    };

    const initialState = {
        values: {
            imageFile: null,
            image: null,
            firstName: "",
            lastName: "",
            username: "",
            phone: null,
        },
        errors: {
            image: null,
            firstName: null,
            lastName: null,
            username: null,
            phone: null,
        },
        changed: false,
        imageChanged: false,
        serverError: false
    };

    const formReducer = (state, action) => {
        switch (action.type) {
            case "SET_VALUE":
                return { ...state, values: { ...state.values, [action.field]: action.value } };
            case "SET_ERROR":
                return { ...state, errors: { ...state.errors, [action.field]: action.value } };
            case "SET_CHANGED":
                return { ...state, changed: true };
            case "RESET_CHANGED":
                return { ...state, changed: false };
            case "SET_IMAGE_CHANGED":
                return { ...state, imageChanged: true };
            case "RESET_IMAGE_CHANGED":
                return { ...state, imageChanged: false };
            case "SET_SERVER_ERROR":
                return { ...state, serverError: action.value };
            case "RESET_SERVER_ERROR":
                return { ...state, serverError: false };
            default: return state;
        }
    };

    const [state, dispatch] = useReducer(formReducer, initialState);

    useEffect(() => {
        dispatch({ type: "SET_VALUE", field: "image", value: optimizeCloudinary(user.image) });
        dispatch({ type: "SET_VALUE", field: "firstName", value: user.firstName });
        dispatch({ type: "SET_VALUE", field: "lastName", value: user.lastName });
        dispatch({ type: "SET_VALUE", field: "username", value: user.username });
        dispatch({ type: "SET_VALUE", field: "phone", value: user.phone });
    }, [user]);

    useEffect(() => {
        if (optimizeCloudinary(user.image) !== state.values.image || user.firstName !== state.values.firstName || user.lastName !== state.values.lastName || user.username !== state.values.username || user.phone !== state.values.phone) {
            dispatch({ type: "SET_CHANGED" });
        }
        else {
            dispatch({ type: "RESET_CHANGED" });
        }
    }, [state.values.firstName, state.values.lastName, state.values.username, state.values.phone, state.values.image]);

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image")) {
            dispatch({ type: "SET_ERROR", field: "image", value: "الرجاء إدخال صور فقط" });
            return;
        }
        else {
            dispatch({ type: "SET_ERROR", field: "image", value: null });
        }
        dispatch({ type: "SET_VALUE", field: "imageFile", value: file });
        const newfile = URL.createObjectURL(file);
        dispatch({ type: "SET_VALUE", field: "image", value: newfile });
        dispatch({ type: "SET_IMAGE_CHANGED" });
    };

    useEffect(() => {
        if (!state.values.imageFile) return;

        const objectURL = state.values.image;

        return () => {
            if (objectURL && objectURL.startsWith("blob:")) {
                URL.revokeObjectURL(objectURL);
            }
        };
    }, [state.values.imageFile]);

    const updateImageInDB = async (secure_url, public_id) => {
        try {
            const res = await updateImage(secure_url, public_id);
            console.log(res);
            dispatch({ type: "SET_ERROR", field: "image", value: null });
            dispatch({ type: "RESET_IMAGE_CHANGED" });
            dispatchToRedux(setinfo({ image: res.data.image }));
        } catch (e) {
            console.log("فشل إرسال الصورة إلى قاعدة البيانات", e);
            dispatch({ type: "SET_ERROR", field: "image", value: e });
        }
    };

    const updateProfileHandler = async () => {
        if (state.imageChanged && state.values.imageFile) {
            const formData = new FormData();
            formData.append("id", user.id);
            formData.append("file", state.values.imageFile);
            try {
                setLoading(true);
                setLoadingText("جاري رفع الصورة الرجاء عدم الخروج ...");
                const res = await fetch("api/user/upload-profile-image", {
                    method: "POST",
                    body: formData
                });
                console.log(res);
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    dispatch({ type: "SET_ERROR", field: "image", value: null });
                    updateImageInDB(data.url, data.image_public_id);

                }
            } catch (e) {
                console.log("فشل إرسال الصورة", e);
                dispatch({ type: "SET_ERROR", field: "image", value: e });
            } finally {
                setLoading(false);
                setLoadingText("");
            }
        }
        const dataToSend = {
            firstName: state.values.firstName,
            lastName: state.values.lastName,
            username: state.values.username,
            phone: state.values.phone
        };
        try {
            setLoading(true);
            setLoadingText("جاري تحديث الملف الشخصي الرجاء عدم الخروج...");
            const response = await updateUserByUserId(dataToSend);
            console.log(response);
            dispatchToRedux(setinfo(dataToSend));
            dispatch({ type: "RESET_SERVER_ERROR" });
            dispatch({ type: "RESET_CHANGED" });
            setFeedBackMounted(true);
            setFeedBackText("تم تحديث الملف الشخصي بنجاح 🗹");
        } catch (e) {
            console.log("فشل تحديث المستخدم", e);
            dispatch({ type: "SET_SERVER_ERROR", value: e });
        } finally {
            setLoading(false);
            setLoadingText("");
        }
    };

    const unMountConfirmHandler = () => {
        setFeedBackMounted(false);
    };

    const updateDisabled = () => {
        return Object.values(state.errors).some(value => value !== null) ||
            !state.changed;
    };

    return <div className={classes.profile_page}>
        <div className={classes.profile_container}>
            <div className={classes.header}>
                <div className={classes.imageWrapper}>
                    <img className={classes.image} src={state.values.image || "/assets/pics/userpic/profile-user.png"} onClick={clickImageHandler} />
                    <div className={classes.clickToChange} onClick={(e) => { clickImageHandler(e) }}>اضغط لتغيير الصورة</div>
                    {state.errors.image && <p className={classes.imageError}>{state.errors.image}</p>}
                </div>
                <input type="file" accept="image/*" ref={imageInput} style={{ display: "none" }} onChange={changeImageHandler} />
                <div className={classes.sideHeaderInfo}>
                    <h1><img src="/assets/icons/user/icons8-name-24.png" /> {user.username}</h1>
                    <h2><img src="/assets/icons/user/icons8-name-24-blue.png" /> {user.firstName} {user.lastName}</h2>
                    <h3><img src="/assets/icons/userrole/pass.png" /> مستخدم {user.role === "USER" ? "عادي" : "أدمن"}</h3>
                    <h4><img src="/assets/icons/email/mail3.png" /> {user.email}</h4>
                    <h5><img src="/assets/icons/date/date.png" width={24} height={24} /> منذ : {createdAt}</h5>
                    <h6><img src="/assets/icons/subscription/subscription.png" width={24} height={24} /> نوع الاشتراك : {user.subscription}</h6>
                </div>
            </div>
            <div className={classes.body}>
                <div className={classes.inputsSection}>
                    <div className={classes.inputWrapper}>
                        <label>الاسم الأول</label>
                        <input
                            type="text"
                            value={state.values.firstName || ""}
                            className={`${classes.input} ${state.errors.firstName ? classes.inputError : ""}`}
                            onChange={(e) => {
                                dispatch({ type: "SET_VALUE", field: "firstName", value: e.target.value });
                            }}
                            onBlur={(e) => {
                                const validation = validateFirstName(e.target.value);
                                if (validation) {
                                    dispatch({ type: "SET_ERROR", field: "firstName", value: validation });
                                }
                                else {
                                    dispatch({ type: "SET_ERROR", field: "firstName", value: null });
                                }
                            }}
                        />
                        {state.errors.firstName && <p>{state.errors.firstName}</p>}
                    </div>
                    <div className={classes.inputWrapper}>
                        <label>الاسم الأخير</label>
                        <input
                            type="text"
                            value={state.values.lastName || ""}
                            className={`${classes.input} ${state.errors.lastName ? classes.inputError : ""}`}
                            onChange={(e) => {
                                dispatch({ type: "SET_VALUE", field: "lastName", value: e.target.value });
                            }}
                            onBlur={(e) => {
                                const validation = validateLastName(e.target.value);
                                if (validation) {
                                    dispatch({ type: "SET_ERROR", field: "lastName", value: validation });
                                }
                                else {
                                    dispatch({ type: "SET_ERROR", field: "lastName", value: null });
                                }
                            }}
                        />
                        {state.errors.lastName && <p>{state.errors.lastName}</p>}
                    </div>
                </div>
                <div className={classes.inputsSection}>
                    <div className={classes.inputWrapper}>
                        <label>اسم المستخدم</label>
                        <input
                            type="text"
                            value={state.values.username || ""}
                            className={`${classes.input} ${state.errors.username ? classes.inputError : ""}`}
                            onChange={(e) => {
                                dispatch({ type: "SET_VALUE", field: "username", value: e.target.value });
                            }}
                            onBlur={(e) => {
                                const validation = validateUserName(e.target.value);
                                if (validation) {
                                    dispatch({ type: "SET_ERROR", field: "username", value: validation });
                                }
                                else {
                                    dispatch({ type: "SET_ERROR", field: "username", value: null });
                                }
                            }}
                        />
                        {state.errors.username && <p>{state.errors.username}</p>}
                    </div>
                    <div className={classes.inputWrapper}>
                        <label>رقم الهاتف</label>
                        <input
                            type="text"
                            value={state.values.phone || ""}
                            className={`${classes.input} ${state.errors.phone ? classes.inputError : ""}`}
                            onChange={(e) => {
                                dispatch({ type: "SET_VALUE", field: "phone", value: e.target.value });
                            }}
                            onBlur={(e) => {
                                const validation = validatePhone(e.target.value);
                                if (validation) {
                                    dispatch({ type: "SET_ERROR", field: "phone", value: validation });
                                }
                                else {
                                    dispatch({ type: "SET_ERROR", field: "phone", value: null });
                                }
                            }}
                        />
                        {state.errors.phone && <p>{state.errors.phone}</p>}
                    </div>
                </div>
            </div>
            {state.serverError && <p className={classes.serverError}>{state.serverError}</p>}
            <button className={classes.updatebtn} disabled={updateDisabled()} onClick={updateProfileHandler}>تحديث الملف الشخصي</button>
        </div>
        {loading && <Loading text={loadingText || null} />}
        {feedBackMounted && ReactDOM.createPortal(<Confirm text={feedBackText} unMount={unMountConfirmHandler} />, document.getElementById("feedback_modal_root"))}
    </div>
}
export default AccountInfo;