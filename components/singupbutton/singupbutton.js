'use client'
import classes from './singupbutton.module.css';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useNotificationUI } from '../notifications/notifications-provider';

const AuthButton = () => {
    const { setOpen, unreadCount, setUnreadCount, connected } = useNotificationUI();
    const user = useSelector(state => state.user);
    const href = user?.id ? '/profile' : '/login';
    const text = user?.id ? 'الملف الشخصي' : 'تسجيل الدخول';
    const btnClass = user?.id ? classes.profile : classes.signup;
    const bellClass = unreadCount > 0 ? classes.unread : "";

    return (
        <div className={classes.authbutton}>
            <Link href={href} className={`${classes.button} ${btnClass}`}>
                {text}
            </Link>
            {user.id && <div className={`${bellClass}`}>
                <img src='/assets/icons/notifications/notification.png' className={`${classes.noticon}`} onClick={() => {
                    setOpen(prev => !prev);
                    setUnreadCount(0);
                }} />
            </div>}
        </div>
    );
}

export default AuthButton;

