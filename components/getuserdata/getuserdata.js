'use client'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setinfo } from "@/store/userSlice";
import { setLoggedIn, logout } from "@/store/loggedInSlice";

import axios from "axios";
const DUMMY_USER_INFO = {
    id: '1',
    firstname: 'Muhammad',
    lastname: 'Msatat',
    username: 'msatat_23',
    email: 'msatat.2002@gmail.com',
    phonenum: '+963 940349764',
    createdat: '12/06/2025',
    ispremium: 'true',
    sub_type: 'exclusive'
}

const GetUserData = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.user);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/api/me", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                },

            });
            const data = await res.json();
            const user = data.user;
            const userdata = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                created_at: user.created_at,
                subscription: user.subscription,
                profile_image: user.profile_image
            };

            if (res.ok) {
                dispatch(setinfo(userdata));
                dispatch(setLoggedIn());

            }
            console.log("تم تسجيل الدخول", user);
        } catch (err) {
            console.log("خطأ في تسجيل الدخول", err);
            localStorage.removeItem('token');
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);
    useEffect(() => {
        console.log(data);
    }, [data]);
    return null;
}
export default GetUserData;