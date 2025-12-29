import classes from './titledescription.module.css';
import prisma from '@/lib/prisma';
const translationMap = {
    "SALE": "بيع",
    "RENT": "إيجار",
    "MORTGAGE": "رهن",
};
const TitleAndDescription = async ({ id, title, purpose, description }) => {

    return (<div className={classes.container}>
        <div className={classes.weight}>كود العقار : {id}</div>
        <div className={classes.weight}>{title}</div>
        <div className={classes.weight}>{translationMap[purpose]}</div>
        <div className={classes.description}>{description}
        </div> </div>);
};

export default TitleAndDescription;