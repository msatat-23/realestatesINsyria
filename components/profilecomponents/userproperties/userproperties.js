'use client'
import classes from './userproperties.module.css';
import { useEffect, useState } from 'react';
import Property from '@/components/property/property';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Confirm from '@/components/confirmcomponent/confirm';
import { getUserProperties } from '@/app/profile/get-user-data';
import { deleteProperty } from '@/app/addproperty/[id]/delete-data';
import ReactDOM, { createPortal } from "react-dom";
import { search } from '@/data/property/search';
import ConfirmDelete from '@/components/dashboard-components/confirm-delete';
const translationMap = {
    "ACCEPTED": "مقبول",
    "REJECTED": "مرفوض",
    "PENDING": "قيد_المراجعة",
};
const UserProperties = () => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [userproperties, setuserproperties] = useState([]);
    const [properties, setProperties] = useState([]);
    const [id, setid] = useState('');
    const [Loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showConfirmText, setShowConfirmText] = useState(false);
    const [text, setText] = useState('');
    const router = useRouter();
    const userid = useSelector(state => state.user.id);


    const statecolor = (property) => {
        switch (translationMap[property.state]) {
            case 'مقبول':
                return 'green';
            case 'مرفوض':
                return 'red';
            case 'قيد المراجعة':
                return 'grey';
            default:
                return 'grey';
        }
    };

    useEffect(() => {
        const fetchuserproperties = async () => {
            try {
                setLoading(true);
                const properties = await getUserProperties(userid);
                console.log(properties);
                const data = JSON.parse(properties.data);
                console.log(data);
                setProperties(data);
                setuserproperties(data);
                setLoading(false);
            } catch {
                console.log('خطأ في جلب عقارات المستخدم');
                setLoading(false);
            }
        }
        fetchuserproperties();
    }, []);
    const handleDeleteProperty = async () => {
        setShowConfirmDelete(false);
        try {
            setLoading(true);
            const res = await deleteProperty(id);
            const data = JSON.parse(res.data);
            console.log(data);
            if (res.ok) {
                setuserproperties(prev => prev.filter(property => property.id != id));
                setShowConfirm(true);
                setShowConfirmText("تم حذف عقارك بنجاح ✓");
            }
            setLoading(false);
        } catch {
            console.log('فشل في حذف العقار');
            setLoading(false);
            setShowConfirm(true);
            setShowConfirmText("فشل حذف العقار يرجى المحاولة لاحقا X");
        }
    };

    const hideConfirm = () => {
        setShowConfirm(false);
        setShowConfirmText("");
    };

    const searchHandler = (e) => {
        setText(e.target.value);
        if (e.target.value) {
            const result = properties.filter(property => property.title.includes(e.target.value));
            setuserproperties(result);
        }
        else {
            setuserproperties(properties);
        }
    };

    return (<div className={classes.container_p}>
        <input type='search'
            placeholder='ابحث عن عقار باستخدام العنوان'
            value={text}
            onChange={searchHandler}
            className={classes.searchInput}
        />
        <div className={classes.userproperties}>
            {userproperties.map(property => <div key={property.id} className={classes.container}>
                <Property key={property.id} {...property} />
                <div className={classes.btns}>
                    <button className={classes.btn} onClick={() => { router.push(`/addproperty/${property.id}`) }}>تعديل العقار</button>
                    <button className={classes.btn} onClick={() => { setShowConfirmDelete(true); setid(property.id); }}>حذف العقار</button>
                </div>
                <p className={classes.s}>حالة العقار : <span className={classes[statecolor(property)]}>{translationMap[property.state]}</span></p>
            </div>)}
        </div>
        {showConfirmDelete && (
            createPortal(<ConfirmDelete unMount={() => setShowConfirmDelete(false)} confirm={handleDeleteProperty} />, document.getElementById("confirm_delete_modal"))
        )}
        {Loading && (
            <div className={classes.overlay}>
                <div className={classes.spinner}></div>
                <p>جار التحميل...</p>
            </div>
        )}
        {showConfirm && ReactDOM.createPortal(<Confirm text={showConfirmText} unMount={hideConfirm} />, document.getElementById("feedback_modal_root"))}
    </div>);
}
export default UserProperties;