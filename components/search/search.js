"use client";

import { useState, useEffect } from 'react';
import classes from './search.module.css';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateField } from '@/store/advancedsearchSlice';
import Loading from '../loading/loading';
import { usePathname } from 'next/navigation';
const Search = () => {
    const [loading, setloading] = useState(false);
    const router = useRouter();
    const path = usePathname();
    const dispatch = useDispatch();
    const reduxfilters = useSelector(state => state.advancedsearch);



    const SubmissionHandler = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        Object.entries({
            q: reduxfilters.q || "",
            minprice: reduxfilters.min_price || "",
            maxprice: reduxfilters.max_price || "",
            governorate: reduxfilters.governorate?.label || "",
            city: reduxfilters.city?.label || "",
            region: reduxfilters.region?.label || "",
            type: reduxfilters.property_type || "",
            purpose: reduxfilters.property_status || "بيع",
            minarea: reduxfilters.min_area || "",
            maxarea: reduxfilters.max_area || "",
            minrooms: reduxfilters.minroomsNum || "",
            maxrooms: reduxfilters.maxroomsNum || "",
            floor: reduxfilters.floor || ""
        }).forEach(([key, value]) => {
            if (value) params.set(key, value)
        });
        router.push(`/search?${params.toString()}`);
        if (path === '/')
            setloading(true);
    };

    return (
        <div className={classes.search}>
            <div className={classes.options}>
                <span className={`${classes.choice} ${reduxfilters.property_status == "بيع" ? classes.selected : ''}`} onClick={() => {
                    dispatch(updateField({ field: 'property_status', value: "بيع" }));
                }}>بيع</span>
                <span className={`${classes.choice}  ${reduxfilters.property_status == "إيجار" ? classes.selected : ''}`} onClick={() => {
                    dispatch(updateField({ field: 'property_status', value: "إيجار" }));
                }}>إيجار</span>
                <span className={`${classes.choice}  ${reduxfilters.property_status == "رهن" ? classes.selected : ''}`} onClick={() => {
                    dispatch(updateField({ field: 'property_status', value: "رهن" }));
                }}>رهن</span>
            </div>
            <div className={classes.formWrapper}>
                <form onSubmit={SubmissionHandler} className={classes.form}>
                    <div className={classes.searchWrapper}>
                        <input className={classes.input} type='search' placeholder='أدخل عنوان , مدينة , شارع , نوع عقار' value={reduxfilters.q || ''} onChange={(e) => {
                            dispatch(updateField({ field: 'q', value: e.target.value }));
                        }} />
                        <button type='submit' className={classes.searchBtn}>ابحث</button>
                    </div>
                </form>
            </div>
            {
                loading && <Loading />
            }
        </div>
    )
}
export default Search;