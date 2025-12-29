"use client"
import { useEffect, useState } from "react";
import classes from "./view-user.module.css";
import Property from "../property/property";
import { getAllUserDataForAdminServer, getAllUserPropertiesForAdminServer } from "@/app/dashboard/users/server-actions";
import PropertyContainer from "./property-container";



const ViewUserModal = ({ id, unMount }) => {
    const [userData, setUserData] = useState({});
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async (id) => {
            try {
                setLoading(true);
                const res = await getAllUserDataForAdminServer(id);
                setUserData(res);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        const fetchUserProperties = async (id) => {
            try {
                setLoading(true);
                const res = await getAllUserPropertiesForAdminServer(id);
                console.log(JSON.parse(res))
                setProperties(JSON.parse(res));
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData(id);
        fetchUserProperties(id);
    }, [id]);

    return <div className={classes.back_overlay} onClick={unMount}>
        <div className={classes.container} onClick={(e) => e.stopPropagation()}>
            <button
                onClick={unMount}
                className={classes.closeBtn}
                aria-label="إغلاق" >
                ✕
            </button>
            <div className={classes.topSection}>
                <img src={userData.image ? userData.image : '/assets/pics/userpic/profile-user.png'} alt="User" className={classes.userImage} />
                <div className={classes.basicInfo}>
                    <h2>{userData.firstName} {userData.lastName}</h2>
                    <p className={classes.username}>{userData.username}</p>
                    <p className={classes.email}>{userData.email} 📧</p>
                    <p className={classes.phone}>{userData.phone} 📞</p>
                    <p className={classes.joined}> عضو منذ: {new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} 📅</p>
                    <p className={classes.subscription}>نوع الاشتراك: {userData.subscription}</p>
                </div>
            </div>
            <div className={classes.propertiesSection}>
                <h3>عقارات المستخدم</h3>
                <div className={classes.propertiesGrid}>
                    {properties && properties.length > 0 ? (
                        properties.map((property) => (
                            <PropertyContainer key={property.id} property={property} />
                        ))
                    ) : (
                        <p>لا توجد عقارات بعد.</p>
                    )}
                </div>
            </div>
            {loading && <div className={classes.overlay}>
                <div className={classes.spinner}></div>
                <p>جاري التحميل</p>
            </div>}
        </div>
    </div>
};
export default ViewUserModal;