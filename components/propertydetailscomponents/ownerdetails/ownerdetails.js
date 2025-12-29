import Link from 'next/link';
import classes from './ownerdetails.module.css';
import prisma from '@/lib/prisma';
const Ownerdetails = async ({ id }) => {

    const info = await prisma.user.findFirst({
        where: { properties: { some: { id: parseInt(id) } } },
        select: {
            id: true,
            image: true,
            username: true,
            email: true,
            phone: true,
            hidePhone: true,
            hideEmail: true
        }
    });
    const userData = {
        id: info.id,
        image: info.image,
        username: info.username,
        email: info.hideEmail ? null : info.email,
        phone: info.hidePhone ? null : info.phone,
    }

    return (<div className={classes.container}>
        <img className={classes.userpic} src={userData.image || '/assets/pics/userpic/profile-user.png'} />
        <div className={classes.username}>{userData.username}</div>
        <div className={classes.credentials}>
            <p className={classes.property}>البريد الالكتروني : </p>
            <p className={classes.value}>{userData.email || 'غير متوفر'}</p>
        </div>
        <div className={classes.credentials}>
            <p className={classes.property}>رقم الهاتف : </p>
            <p className={classes.value}>{userData.phone || 'غير متوفر'}</p>
        </div>
        <Link className={classes.viewBtn} href={`/viewuserdetails/${userData.id}`}>عرض المستخدم</Link>
    </div>)
}

export default Ownerdetails;