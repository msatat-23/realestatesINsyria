'use client'
import classes from './page.module.css';
import { useEffect } from 'react';
import { useLogInForm } from '@/hooks/useLogInForm';
import SocialButtons from '@/components/socialbuttons/socialbuttons';
import { LoginWithOAuth } from '@/serverrequests/login';
import Loading from '@/components/loading/loading';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    validadteEmail,
    passwordValidation,
    codevalidation
} from '@/lib/validation/uservalidators';
import { Input } from '@/components/form/input';



const LogInClient = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const onSuccess = (res) => {
        console.log(res.data);
    }
    const { state, dispatch, submit } = useLogInForm(onSuccess);



    const inputs = [

        {
            id: '1', name: 'email', type: 'email', placeholder: '*البريد الالكتروني',
            onChange: (e) => { dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value }) },
            value: state.values.email || '',
            onBlur: () => {
                const email = state.values.email;
                const validation = validadteEmail(email);
                if (validation) {
                    dispatch({ type: 'SET_ERROR', field: 'email', value: `${validation}` });
                }
                else {
                    dispatch({ type: 'RESET_ERROR', field: 'email' });
                }
            },
            error: state.errors.email
        },
        {
            id: '2', name: 'password', type: state.showpassword ? 'text' : 'password', placeholder: '*كلمة المرور',
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

    ];


    const formSubmissionHandler = async (e) => {
        e.preventDefault();

        const response = await submit();
        if (response.ok && response.twofactor) {
            dispatch({ type: 'SET_SHOWCODE' });
            return;
        }

        console.log(response);
    };


    useEffect(() => {
        if (error === "OAuthAccountNotLinked") {
            dispatch({ type: "SET_SERVER_ERROR", value: "الرجاء تسجيل الدخول بنفس الموزد الذي تم التسجيل به في البداية!" });
        }
    }, [error]);
    return (<div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 mt-5 mb-100" dir="rtl">
        <form className="space-y-8" onSubmit={formSubmissionHandler}>
            <label className="text-2xl font-semibold text-[#252525] ">تسجيل الدخول</label>
            {!state.showcode && <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10">
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
                <p className='mt-[-25px] text-sm text-blue-700 hover:text-blue-900 hover:underline'><Link href="/reset-password">هل نسيت كلمة المرور؟</Link></p>
            </div>
            }
            {
                state.showcode && <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10">
                    <label className='font-bold '>رمز التحقق</label>
                    <input type='text' placeholder='123456'
                        onChange={(e) => {
                            dispatch({ type: 'SET_CODE', value: e.target.value });
                        }}
                        onBlur={() => {
                            const validation = codevalidation(state.code);
                            if (validation) dispatch({ type: 'SET_ERROR', field: 'code', value: validation });
                            else dispatch({ type: 'RESET_ERROR', field: 'code' });
                        }}
                        dir='ltr'
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder:text-right ${state.errors.code ? 'border-red-300' : 'border-gray-200'
                            }`}
                        required={state.showcode} />
                </div>
            }
            {!state.showcode && <p className="text-sm text-gray-600 mt-4 text-center">
                ليس لديك حساب؟{" "}
                <Link
                    href="/signup"
                    className="text-blue-700 hover:text-blue-900 hover:underline font-medium transition-colors"
                >
                    سجّل الآن
                </Link>
            </p>}
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
                className={`w-full py-3 text-white font-semibold rounded-lg shadow-sm transition-colors duration-150 cursor-pointer ${state.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                disabled={state.loading}
            >تسجيل الدخول</button>
        </form>
        {/* {!state.showcode && < SocialButtons onClick={socialLogingHandler} />} */}
        {state.loading && (
            <Loading />
        )}
    </div>)

}
export default LogInClient;