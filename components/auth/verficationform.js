"use client"
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Loading from "../loading/loading";
import { VerifyEmail } from "@/serverrequests/verifyemail";
import Link from "next/link";
const VerificationForm = () => {
    const [Error, setError] = useState('');
    const [Success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    console.log(token);
    const onSubmit = useCallback(async () => {
        if (!token) {
            setError("حدث شيئ خاطئ!");
            return;
        }
        setLoading(true);
        const res = await VerifyEmail(token);
        setLoading(false);
        if (!res.ok) {
            if (res.error === "TOKEN_EXPIRED") {
                setError("للأسف انتهت مدة صلاحية الرابط يرجى الضغط على الزر أدناه لإرسال رسالة تأكيد جديدة.");
            }
            else {
                setError(res.error);
            }
        }
        else {
            setSuccess("تم تأكيد الحساب بنجاح ✅");
        }
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (<div className="relative h-70 text-center w-[600px] rounded-2xl bg-[#ffffff] shadow-2xl mx-auto mt-[160px] p-12">
        <h1 className=" text-[28px]">المصادقة 🔒</h1>
        {(!Success && !Error) && <p className=" text-gray-700 mt-[30px] mb-[30px]">يتم تأكيد حسابك...</p>}
        {(!Success && !Error) && <BeatLoader />}
        {
            (Error) && (
                <div className='w-fit px-20 py-6 rounded-2xl bg-red-200 flex items-center justify-center shadow-sm mx-auto my-10'>
                    <p className='text-red-500'>{Error}</p>
                </div>
            )
        }
        {
            (Success) && (
                <div className='w-fit px-20 py-6 rounded-2xl bg-green-200 flex items-center justify-center shadow-sm mx-auto my-10'>
                    <p className='text-green-500'>{Success}</p>
                </div>
            )
        }
        <p className="absolute bottom-8 right-[50%] translate-x-[50%] underline text-blue-700">  <Link href="/login">العودة إلى تسجيل الدخول</Link></p>
        {loading && <Loading />}
    </div>)
}
export default VerificationForm;