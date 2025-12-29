import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetinfo } from "@/store/userSlice";
import { useState } from "react";

export default function useLogout() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            await signOut({ redirect: true, callbackUrl: '/login' });

            dispatch(resetinfo());

            router.replace("/login");
            router.refresh();
            return { ok: true, message: "تم تسجيل الخروج بنجاح!" };
        } catch (err) {
            console.error("فشل تسجيل الخروج:", err);
            router.replace("/login");
            return { ok: false, message: "فشل تسجيل الخروج" };
        } finally {
            setLoading(false);
        }
    };

    return { handleLogout, loading };
}
