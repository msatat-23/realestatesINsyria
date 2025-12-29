"use client"
import { useState } from "react";
import classes from "./property-edit-btns.module.css";
import Select from "react-select";
import { updateUserPropertyStateServer } from "@/app/dashboard/users/server-actions";

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
const EditBtns = ({ state }) => {
    const [selected, setSelected] = useState({});
    const [selectedAfterSave, setSelectedAfterSave] = useState({});
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [textConfirm, setTextConfirm] = useState("");
    const disabledSave = selected.label === getSelectValue(state).label ||
        selected.label === selectedAfterSave.label;


    const saveHandler = async () => {
        try {
            setLoading(true);
            const state = getSelectedToSend(selected.label);
            console.log(state);
            const res = await updateUserPropertyStateServer(property.id, state);
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
    return <div className={classes.buttons}>
        <button
            className={classes.viewBtn}
        >عرض العقار</button>
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
    </div>
};
export default EditBtns;