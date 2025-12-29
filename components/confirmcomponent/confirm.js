"use client"
import classes from './confirm.module.css';
const Confirm = ({ text, unMount }) => {

    return (
        <div className={classes.backdrop} onClick={(e) => {
            e.stopPropagation();
            unMount();
        }}>
            <div className={classes.container} onClick={(e) => { e.stopPropagation() }}>
                <p className={classes.p}>{text}</p>
                <button className={classes.btn} onClick={unMount}>حسنا</button>
            </div>
        </div>);
}
export default Confirm;