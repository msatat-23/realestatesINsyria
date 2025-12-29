import Link from "next/link";



const ErrorCard = () => {
    return <div className="relative h-70 text-center w-[600px] rounded-2xl bg-[#ffffff] shadow-2xl mx-auto mt-[160px] p-12">
        <h1 className=" text-[28px]">المصادقة 🔒</h1>
        <p className=" text-red-500 mt-[60px]">حدث شيئ خاطئ!</p>
        <p className="absolute bottom-8 right-[50%] translate-x-[50%] underline text-blue-700">  <Link href="/login">العودة إلى تسجيل الدخول</Link></p>
    </div>
}
export default ErrorCard;