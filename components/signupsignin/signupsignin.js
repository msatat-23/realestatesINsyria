'use client'
import classes from './signupsignin.module.css';
import { useReducer, useState, useEffect } from 'react';
import { Readex_Pro } from 'next/font/google';
import { setLoggedIn } from '@/store/loggedInSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setinfo } from '@/store/userSlice';
import { setActive } from '@/store/notifySlice';


const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });
const SignupLogin = (props) => {
    const dispatchredux = useDispatch();
    const router = useRouter();
    const logstate = useSelector(state => state.loggedin.loggedin);
    const [dosignup, setDosignup] = useState(false);
    const [passworderror, setpassworderror] = useState(false);
    const [showpassword, setshowpassword] = useState(false);
    const [nameerror, setnamevalidation] = useState(false);
    const [usernameerror, setusernameerror] = useState(false);
    const [phoneerror, setphoneerror] = useState(false);
    const [emailerror, setEmailerror] = useState(false);
    const [passerror, setpasserror] = useState(false);
    const [error, seterror] = useState(false);
    const [showchangepassword, setshowchangepassword] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [WrongEmailOrPassword, setWrongEmailOrPassword] = useState(false);
    const submitBtn = dosignup ? 'إنشاء الحساب' : 'تسجيل الدخول';
    const initialState = dosignup ? {
        firstname: '',
        lastname: '',
        username: '',
        phonenumber: '',
        email: '',
        password: '',
        passwordconfirmation: ''
    }
        : {
            email: '',
            password: ''
        };
    const reducerActions = (state, action) => {
        if (action.type === 'SET_FIELD') {
            return {
                ...state, [action.field]: action.value
            }
        }
        else if (action.type === 'RESET') {
            return initialState;
        }
        else {
            return state;
        }


    }
    const [state, dispatch] = useReducer(reducerActions, initialState);

    const gotosignup = () => {
        setDosignup(true);
    }
    const showPassword = () => {
        setshowpassword(prev => !prev);
    }

    const formSubmissionHandler = async (e) => {
        e.preventDefault();
        if (dosignup && (nameerror || usernameerror || phoneerror || emailerror || passworderror || passerror)) {
            seterror(true);
            return;
        }
        try {
            setLoading(true);
            const payload = dosignup
                ? {
                    first_name: state.firstname,
                    last_name: state.lastname,
                    username: state.username,
                    phone: state.phonenumber,
                    email: state.email,
                    password: state.password,
                    password_confirmation: state.passwordconfirmation,
                }
                : { email: state.email, password: state.password };

            const endpoint = dosignup
                ? "http://localhost:8000/api/register"
                : "http://localhost:8000/api/login";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                if (!dosignup) setWrongEmailOrPassword(true);
                setLoading(false);
                return;
            }
            console.log('Login/Register response:', data);
            localStorage.setItem('token', data.token);
            const userdata = data.user;
            dispatchredux(setLoggedIn());
            dispatchredux(setinfo(userdata));
            if (dosignup) dispatchredux(setActive('signup'));
            else dispatchredux(setActive('login'));
            props.hide();
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (dosignup && state.password && state.passwordconfirmation) {
            if (state.password !== state.passwordconfirmation) {
                setpassworderror(true);
            } else {
                setpassworderror(false);
            }
        }
    }, [state.password, state.passwordconfirmation, dosignup]);
    useEffect(() => {
        if (state.firstname && state.lastname) {
            const isarabic = (name) => /^[\u0600-\u06FF]{2,}$/.test(name);
            const isenglish = (name) => /^[a-zA-Z]{2,}$/.test(name);
            if ((isarabic(state.firstname) && isarabic(state.lastname)) || (isenglish(state.lastname) && isenglish(state.firstname))) {
                setnamevalidation(false);
            }
            else {
                setnamevalidation(true);
            }

        }
    }, [state.firstname, state.lastname])
    useEffect(() => {
        const t = setTimeout(() => {
            seterror(false);
        }, 3000);
        return () => clearTimeout(t);
    }, [error])
    const changepasshandler = () => {
        // fetch api for changing password
        //link clicked
        //        setshowchagefields(true);
    }
    useEffect(() => {
        dispatch({ type: 'RESET' });
    }, [dosignup]);
    return (<div className={`${classes.signcontainer} ${Readex_Pro_Font.className}`}>
        {error && <p className={classes.error}>إدخال غير صحيح .</p>}
        <img className={classes.exit} onClick={props.hide} src='/assets/icons/exit/no.png' />
        <div className={classes.imagearea}>
            <img className={classes.signpic} src='/assets/pics/signuploginpage/ChatGPT Image May 7, 2025, 10_34_23 AM.png' />
        </div>

        {!showchangepassword && <form className={`${classes.form} `} onSubmit={formSubmissionHandler}>
            {!dosignup ? <label className={classes.mainlabel}>تسجيل الدخول</label> :
                <label className={classes.mainlabel}>إنشاء حساب</label>}
            <div className={classes.info}>
                {dosignup && <input type='text'
                    placeholder='الاسم الأول*'
                    className={classes.smallinput}
                    onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'firstname', value: e.target.value }) }}
                    value={state.firstname || ''}
                    onBlur={() => {
                        const name = state.firstname.trim();
                        const nameReg = /^([\u0600-\u06FF]{2,}|[a-zA-Z]{2,})$/;
                        if (!nameReg.test(name)) {
                            setnamevalidation(true);
                            return;
                        }
                    }}
                    required />}
                {dosignup && <input type='text'
                    placeholder='الاسم الأخير*'
                    className={classes.smallinput}
                    onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'lastname', value: e.target.value }) }}
                    value={state.lastname || ''}
                    onBlur={() => {
                        const name = state.lastname.trim();
                        const nameReg = /^([\u0600-\u06FF]{2,}|[a-zA-Z]{2,})$/;
                        if (!nameReg.test(name)) {
                            setnamevalidation(true);
                            return;
                        }
                    }}
                    required />}
                {nameerror && <p className={classes.passerror}>الاسم الأول والاسم الأخير لايجب ان يحتويان على أرقام ولا محارف مميزة ولايقلان عن محرفين وأن يكون إما باللغة العربية أو باللغة الإنكليزية وأن يكون كلا الحقلين بنفس اللغة .</p>}
                {dosignup && <input type='text'
                    placeholder='*اسم المستخدم'
                    className={`${classes.smallinput} ${classes.username}`}
                    onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value }) }}
                    value={state.username || ''}
                    onBlur={() => {
                        const username = state.username.trim();
                        const usernameReg = /^[a-zA-Z][a-zA-Z0-9*&^%$#@!_\-=+().<>{}]*$/;
                        if (!usernameReg.test(username)) {
                            setusernameerror(true);
                        }
                        else {
                            setusernameerror(false);
                        }
                    }}
                    dir='ltr'
                    required />}

                {dosignup && <input type='text'
                    placeholder='*رقم الهاتف'
                    className={`${classes.smallinput} ${classes.username}`}
                    onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'phonenumber', value: e.target.value }) }}
                    value={state.phonenumber || ''}
                    onBlur={() => {
                        const phone = state.phonenumber.trim();
                        const phoneReg = /^(09|\+963\s?9)\d{8}$/;
                        if (!phoneReg.test(phone)) {
                            setphoneerror(true);
                        }
                        else {
                            setphoneerror(false);
                        }
                    }}
                    required />}
                {usernameerror && <p className={classes.passerror}>اسم المستخدم يجب أن يبدأ بمحرف وأن يكون باللغة الانكليزية .</p>}
                {phoneerror && <p className={classes.passerror}>يجب أن يبدأ رقم الهاتف ب 09 أو 9 963+ ومن ثم 8 أرقام ويجب أن يكون بالأرقام الانكليزية .</p>}
                <input type='email'
                    placeholder='البريد الالكتروني*'
                    className={classes.wideinput}
                    onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value }); setWrongEmailOrPassword(false); }}
                    value={state.email || ''}
                    onBlur={() => {
                        const email = state.email;
                        const emailReg = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._%+-]+@(?!(?:-|\.)|.*(?:-|\.)$)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
                        if (!emailReg.test(email)) {
                            setEmailerror(true);
                        }
                        else {
                            setEmailerror(false);
                        }
                    }}
                    required />
                {emailerror && <p className={classes.passerror}>البريد الالكتروني غير صالح .</p>}
                <div className={`${classes.passinput} `}>
                    <input type={showpassword ? 'text' : 'password'}
                        placeholder='*كلمة المرور'
                        className={`${classes.wideinput} ${classes.setdirection}`}
                        onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value }); setWrongEmailOrPassword(false); }}
                        value={state.password || ''}
                        onBlur={() => {
                            const pass = state.password;
                            const passReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*().])[A-Za-z\d!@#$%^&*().]{8,32}$/;
                            if (!passReg.test(pass)) {
                                setpasserror(true);
                            }
                            else {
                                setpasserror(false);
                            }


                        }}
                        required />

                    <img className={classes.showpasscl}
                        src={`${showpassword ? '/assets/icons/showandhidepass/hide.png' : '/assets/icons/showandhidepass/eye (1).png'}`}
                        onClick={showPassword} />
                </div>
                {passerror && dosignup && <p className={classes.passerror}>
                    كلمة المرور يجب أن تحتوي على حرف كبير وحرف مميز ورقم على الأقل وتكون 8 رموز على الأقل وألا تتخطى 32 رمزا وأن تكون بالانكليزية .
                </p>}
                <div className={classes.passinput}>
                    {dosignup && <input type={showpassword ? 'text' : 'password'}
                        placeholder='*تأكيد كلمة المرور'
                        className={`${classes.wideinput} ${classes.setdirection}`}
                        onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'passwordconfirmation', value: e.target.value }) }}
                        value={state.passwordconfirmation || ''}
                        required />}
                    {dosignup && <img className={classes.showpasscl}
                        src={`${showpassword ? '/assets/icons/showandhidepass/hide.png' : '/assets/icons/showandhidepass/eye (1).png'}`}
                        onClick={showPassword} />}
                </div>
                {passworderror && <p className={classes.passerror}>كلمة المرور غير متطابقة</p>}
                {WrongEmailOrPassword && <p className={classes.passerror}>البريد الإلكتروني أو كلمة المرور غير صحيحة ❌</p>}
                <div className={classes.termssection}>{dosignup && <input type='checkbox' className={classes.checkbox} />}
                    {dosignup && <p className={classes.terms}>أوافق على <a className={classes.a}>سياسة الخصوصية </a>و <a className={classes.a}>شروط الاستخدام </a></p>}</div>
                {!dosignup && <p className={`${classes.p} ${classes.pointer}`} onClick={() => { setshowchangepassword(true) }}>نسيت كلمة المرور؟</p>}
                {!dosignup && <p className={classes.p}>ليس لديك حساب؟<span className={classes.reg} onClick={gotosignup}>سجل هنا</span></p>}
            </div>
            <input type='submit' className={classes.submit} value={submitBtn} disabled={Loading} />
            {Loading && (
                <div className={classes.overlay}>
                    <div className={classes.spinner}></div>
                    <p>جار التحميل...</p>
                </div>
            )}

        </form>}

        {showchangepassword && <div className={` ${classes.form}`}>
            <label className={classes.mainlabel}>أدخل البريد الالكتروني</label>
            <div className={classes.info}> <input type='email'
                placeholder='البريد الالكتروني*'
                className={classes.wideinput}
                onChange={(e) => { dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value }) }}
                value={state.email || ''}
                required />
            </div>
            <button className={classes.submit} onClick={changepasshandler}>استرجاع كلمة المرور</button>
        </div>}
    </div>)
}

export default SignupLogin;