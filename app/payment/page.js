"use client";
import React, { Fragment } from "react";
import { useState } from "react";
import classes from "./payment.module.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { sendSubscripeRequest } from "../profile/update-user";
import Loading from "@/components/loading/loading";
import Confirm from "@/components/confirmcomponent/confirm";
import ReactDOM from "react-dom";


const subscriptionMap = {
    "الاشتراك المجاني": "FREE",
    "الاشتراك المميز": "PREMIUM",
    "الاشتراك الحصري": "EXCLUSIVE"
};

export default function PaymentPage({ searchParams }) {
    const plan = React.use(searchParams)?.plan || "الاشتراك المميز";

    const [selectedMethod, setSelectedMethod] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setloading] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [mountConfirm, setMountConfirm] = useState(false);
    const handlePaymentMethod = (method) => {
        setSelectedMethod(method);
        setSuccess(false);
        setError("");
        setReceiptFile(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        const maxSize = 1024 * 1024;
        if (file.size > maxSize) setError("الرجاء رفع الايصال بحجم اقل من 2 ميغا.");
        setReceiptFile(file);
        setError("");
    };

    const handleSubmit = async () => {
        if (!receiptFile) {
            setError("يرجى رفع صورة إيصال الدفع.");
            return;
        }

        const arrayBuffer = await receiptFile.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        const formData = new FormData();
        formData.append("subtype", subscriptionMap[plan]);
        formData.append("image", base64String);


        try {
            setloading(true);
            // const data = { subtype: plan, image: receiptFile };
            const res = await sendSubscripeRequest(formData);
            console.log(res);
            if (res.ok) {
                setMountConfirm(true);
                setConfirmText("تم رفع ايصال الدفع سيتم التواصل معك عبر البريد الالكتروني قريبا ...");
            }
        } catch (e) {
            console.log('فشل الطلب', e);
            setMountConfirm(true);
            setConfirmText("فشل رفع ايصال الدفع يرجى المحاولة لاحقا...");
        } finally {
            setloading(false);
        }
    };

    const unMountHandler = () => {
        setMountConfirm(false);
        setConfirmText("");
    };

    return (
        <Fragment>
            <Navbar mainpage={false} />
            <div className={classes.container}>
                <h1 className={classes.title}>الدفع لاشتراك: {plan}</h1>
                <p className={classes.subtitle}>اختر طريقة الدفع المناسبة:</p>

                {!selectedMethod ? (
                    <div className={classes.buttons}>
                        <button
                            className={classes.button}
                            onClick={() => handlePaymentMethod("سيريتل كاش")}
                        >
                            الدفع عبر سيريتل كاش
                        </button>
                        <button
                            className={classes.button}
                            onClick={() => handlePaymentMethod("MTN كاش")}
                        >
                            الدفع عبر MTN كاش
                        </button>
                    </div>
                ) : (
                    <div className={classes.paymentSection}>
                        <p className={classes.selectedMethod}>
                            تم اختيار: {selectedMethod}
                        </p>

                        <p className={classes.walletNumber}>
                            رقم المحفظة:{" "}
                            {selectedMethod === "سيريتل كاش" ? "0988123456" : "0933123456"}
                        </p>

                        <label className={classes.uploadLabel}>
                            قم برفع صورة إيصال الدفع:
                            <input
                                type="file"
                                accept="image/*"
                                className={classes.input}
                                onChange={handleFileChange}
                            />
                        </label>

                        {error && <p className={classes.error}>{error}</p>}

                        <div className={classes.buttons}>
                            <button className={classes.button} onClick={handleSubmit}>
                                تأكيد الدفع
                            </button>
                            <button
                                className={`${classes.button} ${classes.cancelButton}`}
                                onClick={() => setSelectedMethod(null)}
                            >
                                تغيير الطريقة
                            </button>
                        </div>
                    </div>
                )}

                {success && (
                    <div className={classes.successMessage}>
                        تم إرسال إيصال الدفع بنجاح! سيتم تفعيل اشتراكك خلال فترة قصيرة.
                    </div>
                )}
                {loading && (
                    <Loading text={"جاري رفع ايصال الدفع يرجى عدم الخروج..."} />
                )}
                {mountConfirm && ReactDOM.createPortal(<Confirm text={confirmText} unMount={unMountHandler} />, document.getElementById("feedback_modal_root"))}
            </div>
            <Footer />
        </Fragment>
    );
}
