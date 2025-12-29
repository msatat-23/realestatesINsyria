"use client"
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Loading from "../loading/loading";
import { useChangePasswordForm } from "@/hooks/useChangePassword";
import { Input } from "../form/input";
import { passwordValidation } from "@/lib/validation/uservalidators";
import { passwordMatchValidation } from "@/lib/validation/uservalidators";
import { useSelector } from 'react-redux';
import { VerifyEmail } from "@/serverrequests/verifyemail";
import Link from "next/link";
const ResetPasswordClient = () => {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { state, dispatch, submit } = useChangePasswordForm();
    const user = useSelector(state => state.user);
    console.log(token);
    const inputs = [
        {
            id: '6', name: 'password', type: state.showpassword ? 'text' : 'password', placeholder: '*كلمة المرور',
            onChange: (e) => { dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value }) },
            value: state.values.password || '',
            onBlur: () => {
                const pass = state.values.password;
                const validation = passwordValidation(pass);
                if (validation) {
                    dispatch({ type: 'SET_ERROR', field: 'password', value: `${validation}` });
                }
                else {
                    dispatch({ type: 'RESET_ERROR', field: 'password' });
                }
            },
            error: state.errors.password
        },
        {
            id: '7', name: 'passwordconfirmation', type: state.showpassword ? 'text' : 'password', placeholder: '*تأكيد كلمة المرور',
            onChange: (e) => { dispatch({ type: 'UPDATE_PASSWORD_CONFIRMATION', value: e.target.value }) },
            value: state.passwordconfirmation || '',
            onBlur: () => {
                const pass = state.values.password;
                const passconfirmation = state.passwordconfirmation;
                const validation = passwordMatchValidation(pass, passconfirmation);
                if (validation) {
                    dispatch({ type: 'SET_ERROR', field: 'passwordmatch', value: `${validation}` })
                }
                else {
                    dispatch({ type: 'RESET_ERROR', field: 'passwordmatch' })
                }
            },
            error: state.errors.passwordmatch
        },
    ];
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            dispatch({ type: "SET_SERVER_ERROR", value: "الرابط غير صالح!" });
            return null;
        }
        setLoading(true);
        const res = await submit(token);
        setLoading(false);
        console.log(res);
    }


    return (<div className="relative h-fit w-[600px] rounded-2xl bg-[#ffffff] shadow-2xl mx-auto mt-[100px] p-12">
        <h1 className=" text-[28px]">تغيير كلمة المرور</h1>
        <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10">
                {inputs.map(input =>
                    <div key={input.id} className="col-span-1">
                        <Input
                            name={input.name}
                            type={input.type}
                            placeholder={input.placeholder}
                            onChange={input.onChange}
                            value={input.value}
                            onBlur={input.onBlur}
                            error={input.error}
                            state={state}
                            dispatch={dispatch}
                        />
                    </div>
                )}
            </div>


            {
                (state.server && !state.success) && (
                    <div className='w-fit px-20 py-6 rounded-2xl bg-red-200 flex items-center justify-center shadow-sm mx-auto'>
                        <p className='text-red-500'>{state.server}</p>
                    </div>
                )
            }
            {
                state.success && (
                    <div className='w-fit px-20 py-6 rounded-2xl bg-green-200 flex items-center justify-center shadow-sm mx-auto'>
                        <p className='text-green-500'>{state.success}</p>
                    </div>
                )
            }
            <button type='submit'
                className={`w-full py-3 text-white font-semibold rounded-lg shadow-sm transition-colors duration-150 cursor-pointer mt-4 mb-4 ${state.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                disabled={state.loading}
            >تغيير كلمة المرور</button>
        </form>
        <p className="absolute bottom-4 right-[50%] translate-x-[50%] underline text-blue-700">
            {user?.id && <Link href="/">العودة إلى الصفحة الرئيسية</Link>}
            {!user?.id && <Link href="/login">العودة إلى تسجيل الدخول</Link>}
        </p>
        {loading && <Loading />}
    </div>)
}
export default ResetPasswordClient;