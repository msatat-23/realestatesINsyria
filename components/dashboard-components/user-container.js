"use client"
import classes from "./user-container.module.css";
import Select from "react-select";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ConfirmDelete from "./confirm-delete";

const roleTranslater = {
    "USER": "مستخدم عادي",
    "ADMIN": "أدمن",
    "SUPERADMIN": "سوبر أدمن"
};

const roleOptions = [
    { value: "USER", label: "USER" },
    { value: "ADMIN", label: "ADMIN" },
    { value: "SUPERADMIN", label: "SUPERADMIN" },
];


const UserContainer = ({ user, setViewUser, setViewedUserId }) => {
    const [role, setRole] = useState(null);
    const [showDelete, setShowDelete] = useState(false);


    useEffect(() => {
        setRole({ value: user.role, label: user.role });
    }, [user]);

    const showUserHandler = (id) => {
        setViewUser(true);
        setViewedUserId(id);
    };

    const showDeleteHandler = () => {
        setShowDelete(true);
    };

    const hideDelete = () => {
        setShowDelete(false);
    };

    const deleteHandler = () => {

    }

    return <div key={user.id} className={classes.user}>
        {showDelete && createPortal(<ConfirmDelete unMount={hideDelete} confirm={deleteHandler} />, document.getElementById("confirm_delete_modal"))}
        <div className={classes.row}>
            <p className={classes.username}>{user.username}</p>
            <div className={classes.user_info}>
                <p>الوظيفة : <span>{roleTranslater[user.role]}</span></p>
                <p>عدد العقارات : <span>{user._count.properties}</span></p>
            </div>
            <button className={classes.viewbtn} onClick={() => { showUserHandler(user.id) }}>عرض المستخدم</button>
        </div>
        <div className={classes.row}>
            <Select
                value={role}
                options={roleOptions}
                onChange={(option) => {
                    setRole(option)
                }}
                styles={{
                    control: (base) => ({
                        ...base,
                        width: "200px",
                        backgroundColor: "#F7E7CE",
                        fontWeight: "900",
                        fontFamily: "Tajawal",
                        fontSize: "18px",
                        cursor: "pointer"
                    }),
                    option: (base) => ({
                        ...base,
                        fontWeight: "900",
                        fontFamily: "Tajawal",
                        fontSize: "18px",
                    })
                }}
            />
            <button className={classes.saveBtn} disabled={user.role === role?.value}>
                حفظ
            </button>
            <button className={classes.deleteBtn} disabled={user.role === "SUPERADMIN"} onClick={showDeleteHandler}>
                حذف المستخدم
            </button>
        </div>
    </div>
};
export default UserContainer;