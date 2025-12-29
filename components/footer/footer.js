import classes from './footer.module.css';
import Link from 'next/link';
import { Readex_Pro } from 'next/font/google';
const Readex_Pro_Font = Readex_Pro({
    subsets: ['arabic'],
    weight: '400'
});
const Footer = () => {



    return (<div className={`${classes.footer} ${Readex_Pro_Font.className}`} >
        <div className={`${classes.section} ${classes.left}`}>
            <div className={`${classes.self}`}><h3>تواصل معنا</h3></div>
            <div className={classes.socials}>
                <a className={classes.link}> <img className={classes.social} src='/assets/icons/socials/social.png' /></a>
                <a className={classes.link}> <img className={classes.social} src='/assets/icons/socials/youtube.png' /></a>
                <a className={classes.link}> <img className={classes.social} src='/assets/icons/socials/whatsapp.png' /></a>
                <a className={classes.link}> <img className={classes.social} src='/assets/icons/socials/facebook.png' /></a>
                <a className={classes.link}> <img className={classes.social} src='/assets/icons/socials/linkedin.png' /></a>



            </div>
            <div className={classes.logoinfo}>
                <p>963940349764+</p>
                <img className={classes.img} src='/assets/icons/phone/phone-call.png' />
            </div>
            <div className={classes.logoinfo}>
                <p>mohammad.18@gmail.com</p>
                <img className={classes.img} src='/assets/icons/email/email.png' />
            </div>
        </div>
        <div className={`${classes.section} ${classes.center}`}>
            <div className={`${classes.self}`}><h3>حقوق النشر محفوظة</h3></div>
            <div><img className={classes.img} src='/assets/pics/footerlogo/logo-light-transparent.png' /></div>
            <div>
                <p>بوصولك واستخدامك لمنصتنا أنت توافق على</p>
                <div className={`${classes.centera}`}>  <Link href='/useterms'>شروط الاستخدام</Link></div>
            </div>

        </div>
        <div className={`${classes.section}  ${classes.center} ${classes.stretch}`}>
            <div className={classes.clickable}><Link href='/contactus'>من نحن</Link></div>
            <div className={classes.clickable}><Link href='/contactus'>اتصل بنا</Link></div>
            <div className={classes.clickable}><Link href='/privacypolicy'>سياسة الخصوصية</Link></div>

        </div>
    </div>)
}
export default Footer;