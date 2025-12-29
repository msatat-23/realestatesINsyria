import { Fragment } from 'react';
import classes from './viewuserdetails.module.css';
import Property from '@/components/property/property';
import prisma from '@/lib/prisma';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';



const UserProfile = async ({ id }) => {

    const info = await prisma.user.findFirst({
        where: { properties: { some: { id: parseInt(id) } } },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            username: true,
            email: true,
            phone: true,
            createdAt: true,
            subscription: true,
            hidePhone: true,
            hideEmail: true,
            hideFirstAndLast: true
        }
    });
    const userData = {
        id: info.id,
        image: info.image,
        firstName: info.hideFirstAndLast ? null : info.firstName,
        lastName: info.hideFirstAndLast ? null : info.lastName,
        username: info.username,
        email: info.hideEmail ? null : info.email,
        phone: info.hidePhone ? null : info.phone,
        createdAt: info.createdAt,
        subscription: info.subscription
    }
    const properties = await prisma.property.findMany({
        where: { userId: parseInt(id) },
        select: {
            id: true,
            title: true,
            description: true,
            purpose: true,
            state: true,
            propertyType: true,
            price: true,
            area: true,
            region: { select: { city: { select: { name: true } }, name: true } },
            subscription: true,
            createdAt: true
        },
    });
    return (
        <Fragment>
            <Navbar mainpage={false} />
            <div className={classes.profileContainer}>
                <div className={classes.topSection}>
                    <img src={userData.image ? userData.image : '/assets/pics/userpic/profile-user.png'} alt="User" className={classes.userImage} />
                    <div className={classes.basicInfo}>
                        <h2>{userData.firstName || "غير متوفر"} {userData.lastName || ""}</h2>
                        <p className={classes.username}>{userData.username}</p>
                        <p className={classes.email}>{userData.email || "غير متوفر"} 📧</p>
                        <p className={classes.phone}>{userData.phone || "غير متوفر"} 📞</p>
                        <p className={classes.joined}> عضو منذ: {new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} 📅</p>
                        <p className={classes.subscription}>نوع الاشتراك: {userData.subscription}</p>
                    </div>
                </div>

                <div className={classes.propertiesSection}>
                    <h3>عقارات المستخدم</h3>
                    <div className={classes.propertiesGrid}>
                        {properties && properties.length > 0 ? (
                            properties.map((property) => (
                                <Property key={property.id} {...property} />
                            ))
                        ) : (
                            <p>لا توجد عقارات بعد.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default UserProfile;
