'use client'
import classes from './savedproperties.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Property from '@/components/property/property';
import Confirm from '@/components/confirmcomponent/confirm';
import { fetchSavedProperties } from '@/app/addproperty/[id]/get-data';
import { deleteSavedPropertyForUser } from '@/app/addproperty/[id]/delete-data';
import ReactDOM, { createPortal } from "react-dom";
import ConfirmDelete from '@/components/dashboard-components/confirm-delete';
import { useRouter } from 'next/navigation';
const SavedProperties = () => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [savedproperties, setsavedproperties] = useState([]);
    const [id, setid] = useState('');
    const [Loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showConfirmText, setShowConfirmText] = useState(false);
    const userid = useSelector(state => state.user.id);

    const router = useRouter();

    useEffect(() => {
        const fetchsavedproperties = async () => {
            try {
                setLoading(true);
                const res = await fetchSavedProperties(userid);
                console.log(res);
                const data = JSON.parse(res.data);
                console.log(data);
                setsavedproperties(data)
                    ;
                setLoading(false);
            } catch {
                console.log('خطأ في جلب العقارات المحفوظة');
                setLoading(false);
            }
        };
        fetchsavedproperties();
    }, []);
    const handleDeleteSavedP = async () => {
        setShowConfirmDelete(false);
        try {
            setLoading(true);
            const res = await deleteSavedPropertyForUser(id);
            console.log(res);
            if (res.ok) {
                console.log(JSON.parse(res.data));
                setsavedproperties(prev => prev.filter(property => property.property.id !== id));
                setShowConfirm(true);
                setShowConfirmText("تم إزالة العقار من العقارات المحفوظة✓");
            }
            setLoading(false);
        } catch (e) {
            console.log('فشل في إزالة العقار من المفضلة ', e);
            setLoading(false);
            setShowConfirm(true);
            setShowConfirmText('فشل في إزالة العقار من المفضلة ');
        }
    };

    const hideConfirm = () => {
        setShowConfirm(false);
        setShowConfirmText("");
    };

    useEffect(() => {
        console.log(id);
    }, [id]);
    return (<div className={classes.savedproperties}>
        {savedproperties.length === 0 && <p className='font-bold mx-auto mt-8 text-3xl text-[#557B97]'>لايوجد عقارات محفوظة لديك.</p>}
        {savedproperties.map((property, index) => <div key={index}>
            <Property  {...property.property} />
            <div className={classes.btns}>
                <button className={classes.btn} onClick={() => {
                    setShowConfirmDelete(true);
                    setid(property.property.id);
                }}>إزالة العقار من العقارات المحفوظة</button>
            </div>
        </div>)}
        {showConfirmDelete && (
            createPortal(<ConfirmDelete unMount={() => setShowConfirmDelete(false)} confirm={handleDeleteSavedP} />, document.getElementById("confirm_delete_modal"))
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
export default SavedProperties;