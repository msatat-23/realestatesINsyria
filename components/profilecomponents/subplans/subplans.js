"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import classes from './subplans.module.css';
import { getUserSubscription } from "@/app/profile/get-user-data";


const subscriptionMap = {
    "FREE": "الاشتراك المجاني",
    "PREMIUM": "الاشتراك المميز",
    "EXCLUSIVE": "الاشتراك الحصري"
};

const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState("الاشتراك المجاني");
    const [userSubsription, setUserSubscription] = useState("FREE");
    const router = useRouter();


    const plans = [
        {
            title: "الاشتراك المجاني",
            price: 0,
            currency: "ل.س",
            features: ["نشر إعلانك على الموقع"],
            disabled: userSubsription === "FREE",
        },
        {
            title: "الاشتراك المميز",
            price: 50000,
            currency: "ل.س",
            features: [
                "إظهار الإعلان على الصفحة الرئيسية",
                "مشاركة إعلانك على صفحات التواصل الخاصة بالموقع"
            ],
            disabled: userSubsription === "PREMIUM",
        },
        {
            title: "الاشتراك الحصري",
            price: 100000,
            currency: "ل.س",
            features: [
                "إظهار الإعلان على الصفحة الرئيسية",
                "مشاركة إعلانك على صفحات التواصل الخاصة بالموقع",
                "أولوية الظهور عند البحث"
            ],
            disabled: userSubsription === "EXCLUSIVE",
        },
    ];


    useEffect(() => {
        const fetchMyPlan = async () => {
            try {
                const res = await getUserSubscription();
                console.log(res);
                setUserSubscription(res.myplan);
                setSelectedPlan(subscriptionMap[res.myplan]);
            } catch (e) {
                console.log("failed at fetching subscription : ", e);
            }
        };
        fetchMyPlan();
    }, []);

    const handleSelect = (plan) => {
        if (!plan.disabled) {
            setSelectedPlan(plan.title);
            if (plan.price > 0) {
                router.push(`/payment?plan=${plan.title}`);
            }
        }
    };

    return (
        <div className={classes.container}>
            <h1 className={classes.title}>اختر نوع الاشتراك</h1>
            <div className={classes.grid}>
                {plans.map((plan) => (
                    <div
                        key={plan.title}
                        className={`${classes.card} ${selectedPlan === plan.title ? classes.selected : ''}`}
                    >
                        <div>
                            <h2 className={classes.cardTitle}>{plan.title}</h2>
                            <p className={classes.price}>
                                {plan.price.toLocaleString()} {plan.currency}
                            </p>
                            <ul className={classes.features}>
                                {plan.features.map((plan, index) => (
                                    <li key={index}> {plan}</li>
                                ))}
                            </ul>
                        </div>
                        {plan.title !== "الاشتراك المجاني" && <button
                            onClick={() => handleSelect(plan)}
                            disabled={plan.disabled}
                            className={`${classes.button}`}
                        >
                            {plan.disabled ? "مشترك" : "اشترك الآن"}
                        </button>}
                    </div>
                ))}
            </div>
            <div className={classes.note}>الاشتراك شهري</div>
        </div>
    );
}
export default SubscriptionPlans;