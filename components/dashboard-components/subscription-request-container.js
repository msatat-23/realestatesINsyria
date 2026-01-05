"use client"
import { useEffect, useState } from "react";
import classes from "./subscription-request-container.module.css";
import Select from "react-select";
import { setRequestAcceptedServer, updateUserSubscriptionServer } from "@/app/dashboard/subscriptions/mutate";
import { createPortal } from "react-dom";
import Confirm from "../confirmcomponent/confirm";
import Loading from "../loading/loading";
import { useRouter } from "next/navigation";

const subOptions = [
    { value: "FREE", label: "FREE" },
    { value: "PREMIUM", label: "PREMIUM" },
    { value: "EXCLUSIVE", label: "EXCLUSIVE" },
];
const SubscriptionRequestContainer = ({ request }) => {
    const [sub, setSub] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setSub({ value: request.user.subscription, label: request.user.subscription });
    }, [request]);
    const image = `data:image/png;base64,${request.image}`;

    const saveHandler = async () => {
        try {
            setLoading(true);
            const res = await updateUserSubscriptionServer(request.user.id, sub?.value);
            console.log(res);
            if (res.ok) {
                try {
                    const response = await setRequestAcceptedServer(request.id);
                    if (response.ok) {
                        setShowConfirm(true);
                        setConfirmText("تم تحديث الاشتراك بنجاح");
                    }
                    else {
                        setShowConfirm(true);
                        setConfirmText("حدث خطأ أثناء تحديث الاشتراك");
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            else {
                setShowConfirm(true);
                setConfirmText("حدث خطأ أثناء تحديث الاشتراك");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const hideConfirm = async () => {
        setShowConfirm(false);
        setConfirmText("");
        router.refresh();
    };

    return <div className={classes.request}>
        {loading && createPortal(<Loading />, document.getElementById("loading_modal"))}
        {showConfirm && createPortal(<Confirm text={confirmText} unMount={hideConfirm} />, document.getElementById("feedback_modal_root"))}
        <img src={image} alt="request_image" />
        <div className={classes.request_info}>
            <div className={classes.info}>
                <p className={classes.p}>اسم المستخدم : {request.user?.username}</p>
                <p className={classes.p}>تم الإرسال في : {new Date(request.createdAt).toLocaleDateString()}</p>
                <p className={classes.p}>الاشتراك المطلوب : {request.subtype}</p>
                <p className={classes.p}>الاشتراك الحالي :{request.user.subscription}</p>
                <p className={classes.p}>تم قبوله : {request.accepted ? "TRUE" : "FALSE"}</p>
            </div>
            <div className={classes.mutate}>
                <Select
                    styles={{
                        control: (base) => ({
                            ...base,
                            width: "160px",
                            height: "43px",
                            cursor: "pointer",
                            backgroundColor: "#faffe5",
                            fontSize: "14px",
                            fontFamily: "Tajawal",
                            fontWeight: "700"
                        }),
                        option: (base) => ({
                            ...base,
                            fontSize: "14px",
                            fontSize: "14px",
                            fontFamily: "Tajawal",
                            fontWeight: "700"
                        })
                    }}
                    value={sub || null}
                    onChange={(selected) => {
                        setSub(selected || null);
                    }}
                    placeholder="تحديد"
                    options={subOptions}
                    isClearable
                />
                <button className={classes.saveBtn} onClick={saveHandler} disabled={sub?.value == request.user?.subscription}>
                    حفظ
                </button>
            </div>
        </div>
    </div>
};
export default SubscriptionRequestContainer;