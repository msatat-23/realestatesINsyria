'use client'
import { Readex_Pro } from 'next/font/google';
import Navbar from '@/components/navbar/navbar';
import SideBar from '@/components/profilecomponents/sidebar/sidebar';
import AccountInfo from '@/components/profilecomponents/accountinfo/accountinfo';
import UserProperties from '@/components/profilecomponents/userproperties/userproperties';
import AccountSettings from '@/components/profilecomponents/accountsettings/accountsettings';
import SubscriptionPlans from '@/components/profilecomponents/subplans/subplans';
import Footer from '@/components/footer/footer';
import SavedProperties from '@/components/profilecomponents/savedproperties/savedproperties';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import classes from "./page.module.css";
const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });

const ProfileClient = (props) => {
    const [key, setKey] = useState('info');

    useEffect(() => {
        if (props.section && props.section !== '') {
            setKey(props.section);
        }
    }, [props.section]);

    const changeHandler = (newKey) => {
        setKey(newKey);
    }

    const userdata = useSelector(state => state.user);
    console.log(userdata);

    const renderSection = () => {
        const accountInfo = (
            <AccountInfo
                firstname={userdata.firstName}
                lastname={userdata.lastName}
                username={userdata.username}
                email={userdata.email}
                phonenum={userdata.phone}
                createdat={userdata.createdAt}
                sub_type={userdata.subscription}
                image={userdata.profileImage}
            />
        );

        switch (key) {
            case 'info':
                return accountInfo;
            case 'myproperties':
                return <UserProperties id={userdata.id} />;
            case 'savedproperties':
                return <SavedProperties id={userdata.id} />;
            case 'sub':
                return <SubscriptionPlans />;
            case 'settings':
                return <AccountSettings />;
            default:
                return accountInfo;
        }
    }

    return (
        <div className={`${Readex_Pro_Font.className}`}>
            <Navbar mainpage={false} />
            <div className={classes.profile_page}>
                <SideBar onchange={changeHandler} />
                {renderSection()}
            </div>
            <Footer />
        </div>
    );
};

export default ProfileClient;
