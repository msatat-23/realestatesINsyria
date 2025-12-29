'use client'
import SocialButtons from '@/components/socialbuttons/socialbuttons';
import Loading from '@/components/loading/loading';
import { socialLogingHandler } from '../enterWithCredentials';
import Link from 'next/link';
import {
    validadteEmail,
} from '@/lib/validation/uservalidators';
import { useSelector } from 'react-redux';
import { Input } from '@/components/form/input';
import { useSendResetForm } from '@/hooks/useSendResetForm';


const ResetPassClient = () => {
    const onSuccess = (res) => {
        console.log(res.data);
    }
    const { state, dispatch, submit } = useSendResetForm(onSuccess);
    const user = useSelector(state => state.user);


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
    ];


    const formSubmissionHandler = async (e) => {
        e.preventDefault();
        const response = await submit();
        console.log(response);
    };


    return (<div className="max-w-3xl mx-auto p-6 py-12 bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 relative mt-20 mb-100" dir="rtl">
        <form className="space-y-8" onSubmit={formSubmissionHandler}>
            <label className="text-2xl font-semibold text-[#252525] ">هل نسيت كلمة المرور؟</label>
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
                className={`w-full py-3 text-white font-semibold rounded-lg shadow-sm transition-colors duration-150 cursor-pointer ${state.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                disabled={state.loading}
            >أرسل البريد الالكتروني لإعادة ضبط كلمة المرور</button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
            {!user?.id && <Link
                href="/login"
                className="text-blue-700 hover:text-blue-900 hover:underline font-medium transition-colors"
            >
                العودة إلى تسجيل الدخول
            </Link>}
        </p>
        {state.loading && (
            <Loading />
        )}
    </div>)

}
export default ResetPassClient;