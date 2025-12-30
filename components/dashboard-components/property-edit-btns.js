"use client"
import { useEffect, useState } from "react";
import classes from "./property-edit-btns.module.css";
import Select from "react-select";
import { updateUserPropertyStateServer } from "@/app/dashboard/users/server-actions";
import { createPortal } from "react-dom";
import Loading from "../loading/loading";
import Confirm from "../confirmcomponent/confirm";
import ConfirmDelete from "./confirm-delete";
import { deleteProperty } from "@/app/addproperty/[id]/delete-data";
import { useRouter } from "next/navigation";

const getSelectValue = (value) => {
    switch (value) {
        case "ACCEPTED":
            return { value: "ACCEPT", label: "ACCEPT" };
        case "REJECTED":
            return { value: "REJECT", label: "REJECT" };
        case "PENDING":
            return { value: "PEND", label: "PEND" };
        default:
            return { value: "PEND", label: "PEND" };
    }
};
const getSelectedToSend = (value) => {
    switch (value) {
        case "ACCEPT":
            return "ACCEPTED";
        case "REJECT":
            return "REJECTED";
        case "PEND":
            return "PENDING";
        default:
            return "PENDING";
    }
};
const EditBtns = ({ id, state }) => {
    const [selected, setSelected] = useState({});
    const [selectedAfterSave, setSelectedAfterSave] = useState({});
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [textConfirm, setTextConfirm] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const router = useRouter();

    const disabledSave = selected.label === getSelectValue(state).label ||
        selected.label === selectedAfterSave.label;

    useEffect(() => {
        const chosen = getSelectValue(state);
        setSelected(chosen);
    }, [state]);


    const saveHandler = async () => {
        try {
            setLoading(true);
            const state = getSelectedToSend(selected.label);
            console.log(state);
            const res = await updateUserPropertyStateServer(id, state);
            console.log(res);
            if (res.ok) {
                setShowConfirm(true);
                setTextConfirm("تم بنجاح ✓");
                setSelectedAfterSave(selected);
            }
            else {
                setShowConfirm(true);
                setTextConfirm(res.error);
            }
        } catch (e) {
            console.log(e);
            setShowConfirm(true);
            setTextConfirm(e);
        } finally {
            setLoading(false);
        }
    };

    const hideDelete = () => {
        setShowConfirmDelete(false);
    };

    const hideConfirm = () => {
        setShowConfirm(false);
        setTextConfirm("");
    };

    const deleteHandler = async () => {
        try {
            setLoading(true);
            const res = await deleteProperty(id);
            if (res.ok) router.push("/dashboard");
            else {
                setShowConfirm(true);
                setTextConfirm("تعذر حذف العقار!!");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return <div className={classes.buttons}>
        <button
            className={classes.viewBtn}
            onClick={() => { setShowConfirmDelete(true) }}
        >حذف العقار</button>
        <Select
            options={[
                { value: "ACCEPT", label: "ACCEPT" },
                { value: "REJECT", label: "REJECT" },
                { value: "PEND", label: "PEND" },
            ]}
            styles={{
                control: (base) => ({
                    ...base, width: "140px", cursor: "pointer"
                })
            }}
            value={selected}
            onChange={(selectedOption) => {
                setSelected(selectedOption);
            }}
        />
        <button disabled={disabledSave}
            className={classes.saveBtn}
            onClick={saveHandler}
        >
            حفظ
        </button>
        {showConfirm && createPortal(<Confirm text={textConfirm} unMount={hideConfirm} />, document.getElementById("feedback_modal_root"))}
        {loading && createPortal(<Loading />, document.getElementById("loading_modal"))}
        {showConfirmDelete && createPortal(<ConfirmDelete unMount={hideDelete} confirm={deleteHandler} />, document.getElementById("confirm_delete_modal"))}
    </div>
};
export default EditBtns;