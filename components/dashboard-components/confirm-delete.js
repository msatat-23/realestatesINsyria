"use client"
import classes from "./confirm-delete.module.css";


const ConfirmDelete = ({ unMount, confirm }) => {

    return <div className={classes.overlay} onClick={unMount}>
        <div className={classes.container} onClick={(e) => e.stopPropagation()}>
            <h1 className={classes.h1}>هذا الإجراء نهائي ولا يمكن التراجع عنه!!</h1>
            <div className={classes.btns}>
                <button className={classes.cancelbtn} onClick={unMount}>إلغاء</button>
                <button className={classes.confirm} onClick={confirm}>تأكيد</button>
            </div>
        </div>
    </div>
};
export default ConfirmDelete;