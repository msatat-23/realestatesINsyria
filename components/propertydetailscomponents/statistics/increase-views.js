"use client"
import { increasePropertyViewsServer } from "@/app/property/[id]/update-property";
import { useEffect, useRef } from "react";

const IncreaseViews = ({ id }) => {
    const called = useRef(false);
    useEffect(() => {
        if (called.current) return;
        called.current = true;
        const increaseViews = async (id) => {
            try {
                const res = await increasePropertyViewsServer(id);
                console.log(res);
            } catch (e) {
                console.log("فشل تحديث مشاهدات العقار", e);
            }
        };
        increaseViews(id);

    }, [id]);
    return null;
};
export default IncreaseViews;