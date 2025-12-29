'use client'
import classes from './navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdvancedSearch from '../advancedsearch/advancedsearch';
import { Readex_Pro } from 'next/font/google';
import ReactDOM from "react-dom";
import AuthButton from '../singupbutton/singupbutton';
const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });
const Navbar = () => {
    const [clicked, setClicked] = useState(false);
    const [ShowAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const pathName = usePathname();

    const clickhandler = () => {
        setClicked(prev => !prev);
    };

    useEffect(() => {
        setShowAdvancedSearch(false);
        setClicked(false);
    }, [pathName]);

    const linkClass = `${classes.a} ${pathName !== "/" ? classes.otherpages : ""} ${clicked ? classes.newcolor1 : ''}`;

    return (
        <div className={`${classes.navbar} ${Readex_Pro_Font.className}`} dir="rtl">
            <AuthButton />

            <img onClick={clickhandler} className={classes.listBtn} src='/assets/icons/menu/hamburger.png' />

            <div className={`${classes.menu}  ${clicked ? classes.show : ''}`}>
                <Link href='/' className={linkClass}>
                    الصفحة الرئيسية
                </Link>
                <Link href='/addproperty/new' className={linkClass}>
                    أعلن عن عقارك
                </Link>
                <button
                    className={linkClass}
                    onClick={() => setShowAdvancedSearch(true)}>
                    البحث المتقدم
                </button>
                <Link href="/profile?section=sub" className={linkClass}>
                    اشترك وأصبح عضو مميز
                </Link>
                <Link href='/contactus' className={linkClass}>
                    تواصل معنا
                </Link>
            </div>

            <Link href='/'>
                <img className={classes.img} src="/assets/pics/logo/logo-dark-transparent.png" alt="company-logo" />
            </Link>

            {ShowAdvancedSearch && ReactDOM.createPortal(<AdvancedSearch hide={() => setShowAdvancedSearch(false)} />, document.getElementById("advanced_search_modal_root"))}
        </div>)

}

export default Navbar;