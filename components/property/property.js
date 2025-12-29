"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import classes from './property.module.css';
import { Readex_Pro } from 'next/font/google';
import Card from '../UI/card';
import { getFirstImageSecureUrl } from '@/app/addproperty/[id]/get-data';
import { addPropTofavorite } from '@/app/addproperty/[id]/send-data';
import ReactDOM from "react-dom";
import Confirm from '../confirmcomponent/confirm';
import Loading from '../loading/loading';

const Readex_Pro_Font = Readex_Pro({
    subsets: ['arabic'],
    weight: '400'
});

const translationMap = {
    "SALE": "بيع",
    "RENT": "إيجار",
    "FREE": "مجاني",
    "PREMIUM": "مميز",
    "EXCLUSIVE": "حصري",
};

const Property = (props) => {
    const router = useRouter();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mountConfirm, setMountConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [loadingImage, setLoadingImage] = useState(false);

    const viewPropertyDetails = () => {
        if (loading) return;
        router.push(`/property/${props.id}`);
    }

    const formattedDate = props.createdAt
        ? new Date(props.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, "-")
        : "بدون تاريخ";

    const addTofavHandler = async () => {
        try {
            setLoading(true);
            const res = await addPropTofavorite(props.id);
            console.log(res);

            if (res.ok) {
                setMountConfirm(true);
                setConfirmText("تم إضافة هذا العقار إلى المفضلة بنجاح ✔️");
            }
            else if (res.type === "EXISTS") {
                setMountConfirm(true);
                setConfirmText("هذا العقار موجود مسبقا في المفضلة ❌");
            }
        }
        catch (e) {
            console.log('خطأ في الاضافة الى المفضلة');
            setMountConfirm(true);
            setConfirmText("تعذر إضافة هذا العقار للمفضلة يرجى المحاولة لاحقا ❌");
        } finally {
            setLoading(false);
        }
    };

    const optimizeCloudinary = (url) => {
        return url.replace("/upload/", "/upload/f_auto,q_auto,w_900/");
    };

    useEffect(() => {
        const fetchimage = async (id) => {
            try {
                setLoadingImage(true)
                const image = await getFirstImageSecureUrl(id);
                console.log(image);

                setImage(optimizeCloudinary(image.secure_url));
            } catch (e) {
                console.log('فشل في جلب الصور ', e);
                setLoadingImage(false);
            }
        };
        if (props.id) {
            fetchimage(props.id);
            console.log(props.id);
        }
    }, []);

    const unMountHandler = () => {
        setMountConfirm(false);
        setConfirmText("");
    };

    return (<Card>
        <div className={`${classes.property} ${Readex_Pro_Font.className}`} onClick={viewPropertyDetails}>
            <div className={classes.imageWrapper}>
                <img className={classes.img} onLoad={() => setLoadingImage(false)} src={image ? image : '/assets/pics/propertydumpic/ChatGPT Image Apr 28, 2025, 04_25_50 PM.png'} alt="propertypic" />
                {loadingImage && <div className={classes.imageOverlay}>
                    <div className={classes.spinner}></div>
                    <p>جار التحميل...</p>
                </div>}
            </div>
            <div className={classes.propdata}>
                <div className={classes.section}>
                    <div className={classes.desc}><p>{props.title}</p></div>
                    <div className={classes.desc}>{translationMap[props.purpose]}</div>
                </div>
                <div className={classes.section}>
                    <div className={classes.first}>
                        <div className={classes.icon}><img src='/assets/icons/propertyprice/price.png' /></div>
                        <div className={classes.desc}>${props.price}</div>
                    </div>
                    <div className={classes.desc}>{props.area}m</div>
                </div>
                <div className={classes.section}>
                    <div className={classes.first}>
                        <div className={classes.icon}><img src='/assets/icons/location/map.png' /></div>
                        <div className={classes.desc}>{props.region.city.name} , {props.region.name}</div>
                    </div>
                    <div className={classes.couple}>
                        <p className={classes.smallp}>إضافة إلى المفضلة</p>
                        <button type="button" className={`${classes.addicon} ${classes.tooltip}`} onClick={(e) => {
                            e.stopPropagation();
                            addTofavHandler();
                        }}>
                            <img className={classes.addimg} src="/assets/icons/addtofav/add-button.png" />
                            <span className={classes.tooltiptext}>إضافة إلى المفضلة</span>
                        </button>
                    </div>
                </div>
                <div className={classes.section}>
                    <div className={classes.first}>
                        <div className={classes.icon}><img src='/assets/icons/date/calendar.png' /></div>
                        <div className={classes.desc}>{formattedDate}</div>
                    </div>
                    <div className={translationMap[props.subscription] == 'مميز' ? classes.specialproperty : translationMap[props.subscription] == 'حصري' ? classes.exclusiveproperty : ''}>{translationMap[props.subscription] != 'مجاني' && translationMap[props.subscription]}</div>
                </div>
            </div>
            {loading && <div className={classes.overlay}>
                <div className={classes.spinner}></div>
                <p>جار التحميل...</p>
            </div>}
            {mountConfirm && ReactDOM.createPortal(<Confirm text={confirmText} unMount={unMountHandler} />, document.getElementById("feedback_modal_root"))}
        </div></Card>
    )
}

export default Property;