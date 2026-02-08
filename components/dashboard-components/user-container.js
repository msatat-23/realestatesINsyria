"use client"
import classes from "./user-container.module.css";
import Select from "react-select";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ConfirmDelete from "./confirm-delete";
import { deleteUserServer, markUserReadServer, updateUserRoleServer } from "@/app/dashboard/users/server-actions";
import Loading from "../loading/loading";
import Confirm from "../confirmcomponent/confirm";
import { useRouter } from "next/navigation";
import { useAdminContext } from "./listen";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [textConfirm, setTextConfirm] = useState("");

    const { setUserCount } = useAdminContext();

    const router = useRouter();

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

    const deleteHandler = async () => {
        try {
            setLoading(true);
            const res = await deleteUserServer(user.id);
            if (res.ok) {
                setTextConfirm("تم بنجاح ✓")
                setShowConfirm(true);
            }
            if (res.error === "UNAUTHORIZED") {
                setTextConfirm("!!" + res.error)
                setShowConfirm(true);
            }
            else if (!res.ok) {
                setTextConfirm("حدث خطأ ما!!");
                setShowConfirm(true);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    // const updateRole = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await updateUserRoleServer(user.id, role.value);
    //         if (res.ok) {
    //             setShowConfirm(true);
    //             setTextConfirm("تم بنجاح ✓");
    //             router.refresh();
    //         }
    //         if (res.error === "UNAUTHORIZED" || res.error === "INVALID ROLE PASSED") {
    //             setShowConfirm(true);
    //             setTextConfirm("!!" + res.error);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const hideConfirm = () => {
        setShowConfirm(false);
        setTextConfirm("");
        router.refresh();
    };

    const markReadHandler = async () => {
        try {
            setLoading(true);
            const res = await markUserReadServer(user.id);
            if (res.ok) {
                setUserCount(prev => prev - 1);
                setShowConfirm(true);
                setTextConfirm("تم بنجاح ✓");
                router.refresh();
            }
            else if (res.error === "UNAUTHORIZED") {
                setShowConfirm(true);
                setTextConfirm("!!" + res.error);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async () => {
        const res = await updateUserRoleServer(user.id, role.value);
        if (!res.ok) throw new Error(res.error || "حدث خطأ");

        return res;
    };

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateUserRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
        onError: (error) => {
            setShowConfirm(true);
            setTextConfirm(error.message);
        },
    });

    const updateRole = () => {
        mutation.mutate();
    };

    return <div key={user.id} className={classes.user}>
        {showConfirm && createPortal(<Confirm text={textConfirm} unMount={hideConfirm} />, document.getElementById("feedback_modal_root"))}
        {mutation.isPending && createPortal(<Loading />, document.getElementById("loading_modal"))}
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
            <button className={classes.saveBtn} disabled={user.role === role?.value} onClick={updateRole}>
                {mutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button className={classes.deleteBtn} disabled={user.role === "SUPERADMIN"} onClick={showDeleteHandler}>
                حذف المستخدم
            </button>
        </div>
        {user.role === "USER" && <button className={classes.readbtn} disabled={user.confirmedByAdmin} onClick={() => { markReadHandler() }}>
            تعليم كمقروء
        </button>}
    </div>
};
export default UserContainer;