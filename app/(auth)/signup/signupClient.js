'use client'
import classes from './page.module.css';
import { useEffect } from 'react';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import Loading from '@/components/loading/loading';
import { useSearchParams } from 'next/navigation';
import SocialButtons from '@/components/socialbuttons/socialbuttons';
import { socialLogingHandler } from '../enterWithCredentials';
import Link from 'next/link';
import {
    validateName,
    validateUserName,
    validatePhone,
    validadteEmail,
    passwordValidation,
    passwordMatchValidation
} from '@/lib/validation/uservalidators';
import { Input } from '@/components/form/input';


const SignUpClient = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const onSuccess = (res) => {
        console.log(res.data);
    }
    const { state, dispatch, submit } = useSignUpForm(onSuccess);



    const inputs = [
        {
            id: '1', name: 'firstname', type: 'text', placeholder: '*الاسم الأول',
            onChange: (e) => { dispatch({ type: 'SET_FIELD', field: 'firstName', value: e.target.value }) },
            value: state.values.firstName || '',
            onBlur: () => {
                const firstname = state.values.firstName;
                const lastname = state.values.lastName;
                const validation = validateName(firstname, lastname, lastname === '');
                if (!validation) {
                    dispatch({ type: 'RESET_ERROR', field: 'name' });
                }
                else {
                    dispatch({ type: 'SET_ERROR', field: 'name', value: validation });
                }
            },
            error: state.errors.name
        },
        {
            id: '2', name: 'lastname', type: 'text', placeholder: '*الاسم الأخير',
            onChange: (e) => { dispatch({ type: 'SET_FIELD', field: 'lastName', value: e.target.value }) },
            value: state.values.lastName || '',
            onBlur: () => {
                const firstname = state.values.firstName;
                const lastname = state.values.lastName;
                const validation = validateName(firstname, lastname);
                if (validation) {
                    dispatch({ type: 'SET_ERROR', field: 'name', value: `${validation}` });
                }
                else {
                    dispatch({ type: 'RESET_ERROR', field: 'name' });
                }
            },
            error: state.errors.name
        },
        {
            id: '3', name: 'username', type: 'text', placeholder: '*اسم المستخدم',
            onChange: (e) => { dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value }) },
            value: state.values.username || '',
            onBlur: () => {
                const username = state.values.username;
                const validation = validateUserName(username);
                if (validation) {
                    dispatch({ type: 'SET_ERROR', field: 'username', value: `${validation}` });
                }
                else {
                    dispatch({ type: 'RESET_ERROR', field: 'username' });
                }
            },
            error: state.errors.username
        },
        {
            id: '4', name: 'phonenumber', type: 'text', placeholder: '*رقم الهاتف',
            onChange: (e) => { dispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value }) },
            value: state.values.phone || '',
            onBlur: () => {
                const phone = state.values.phone;
                const validation = validatePhone(phone);
                if (validation) {
                    dispatch({ type: 'SET_ERROR', field: 'phone', value: `${validation}` })
                }
                else {
                    dispatch({ type: 'RESET_ERROR', field: 'phone' });
                }
            },
            error: state.errors.phone
        },
        {
            id: '5', name: 'email', type: 'email', placeholder: '*البريد الالكتروني',
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


    const formSubmissionHandler = async (e) => {
        e.preventDefault();
        const response = await submit();
        console.log(response);
    };

    useEffect(() => {
        if (error === "OAuthAccountNotLinked") {
            dispatch({ type: "SET_SERVER_ERROR", value: "الرجاء تسجيل الدخول بنفس الموزد الذي تم التسجيل به في البداية!" });
        }
    }, [error]);
    return (<div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 relative mt-5 mb-40" dir="rtl">
        <form className="space-y-8" onSubmit={formSubmissionHandler}>
            <label className="text-2xl font-semibold text-[#252525] ">إنشاء حساب</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
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


            <div className="flex items-center gap-3 ">
                <input
                    type="checkbox"
                    name='checkbox'
                    className='w-4 h-4'
                    onChange={(e) => { dispatch({ type: 'SET_AGREE', value: e.target.checked }) }}
                    checked={!!state.agreeTerms}
                />
                <p className="text-sm text-gray-700">أوافق على <a className="text-blue-600 underline cursor-pointer">سياسة الخصوصية </a>و <a className="text-blue-600 underline cursor-pointer">شروط الاستخدام </a></p>
            </div>

            <p className="text-sm text-gray-600 mt-4 text-center">
                هل لديك حساب؟{" "}
                <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                    تسجيل الدخول
                </Link>
            </p>
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
            >إنشاء الحساب</button>
        </form>
        {/* <SocialButtons onClick={socialLogingHandler} /> */}

        {state.loading && (
            <Loading />
        )}
    </div>)

}
export default SignUpClient;