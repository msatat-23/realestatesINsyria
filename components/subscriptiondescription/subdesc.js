import classes from './subdesc.module.css';
import Card from '../UI/card';
import { Readex_Pro } from 'next/font/google';

const Readex_Pro_Font = Readex_Pro({
    subsets: ['arabic'],
    weight: '400'
});
const Subdesc = () => {




    return (<div className={`${classes.container} ${Readex_Pro_Font.className}`}>
        <Card>    <div className={classes.exclusive}>
            <h1 className={classes.exh}>اشتراك حصري</h1>
            <ul className={classes.list}>
                <li>إظهار الإعلان على الصفحة الرئيسية</li>
                <li>مشاركة إعلانك على صفحات التواصل الخاصة بالموقع</li>
                <li>أولوية الظهور عند البحث</li>
            </ul>
        </div></Card>
        <Card>    <div className={classes.special}>
            <h1 className={classes.sph}>اشتراك مميز</h1>
            <ul className={classes.list}>
                <li>إظهار الإعلان على الصفحة الرئيسية</li>
                <li>مشاركة إعلانك على صفحات التواصل الخاصة بالموقع</li>

            </ul>
        </div></Card>
    </div >);
}


export default Subdesc;