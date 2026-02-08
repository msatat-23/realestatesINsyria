import { useEffect, useState } from "react";
import classes from "./property-container.module.css";
import Link from "next/link";
import Select from "react-select";
import { updateUserPropertyStateServer } from "@/app/dashboard/users/server-actions";
import Loading from "../loading/loading";
import { createPortal } from "react-dom";
import Confirm from "../confirmcomponent/confirm";
import { useRouter } from "next/navigation";
import { useAdminContext } from "./listen";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const altImage = "/assets/pics/propertydumpic/ChatGPT Image Apr 28, 2025, 04_25_50 PM.png";

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
const PropertyContainer = ({ property }) => {
    const [loadingImage, setLoadingImage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [textConfirm, setTextConfirm] = useState("");
    const [selected, setSelected] = useState({});
    const [selectedAfterSave, setSelectedAfterSave] = useState({});
    const router = useRouter();

    const { setPropertyCount } = useAdminContext();

    const createdAt = new Date(property.createdAt).toLocaleDateString();
    const disabledSave = selected.value === getSelectValue(property.state).value;


    useEffect(() => {
        const chosen = getSelectValue(property.state);
        setSelected(chosen);
    }, [property]);

    const updatePropertyState = async ({ id, state }) => {
        const res = await updateUserPropertyStateServer(id, state);

        if (!res.ok) {
            throw new Error(res.error || "حدث خطأ");
        }

        return res;
    };

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updatePropertyState,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["properties"],
            });
            setSelectedAfterSave(selected);
        },

        onError: (error) => {
            setShowConfirm(true);
            setTextConfirm(error.message);
        },
    });

    const saveHandler = () => {
        const state = getSelectedToSend(selected.value);

        mutation.mutate({
            id: property.id,
            state,
        });
    };


    const hideConfirm = () => {
        setShowConfirm(false);
        setTextConfirm("");
    };

    return <div className={classes.container}>
        <div className={classes.top_container}>
            {mutation.isPending &&
                createPortal(<Loading />, document.getElementById("loading_modal"))
            }
            {loading && createPortal(<Loading />, document.getElementById("loading_modal"))}
            {showConfirm && createPortal(<Confirm text={textConfirm} unMount={hideConfirm} />, document.getElementById("feedback_modal_root"))}
            <div className={classes.imageWrapper}>
                {loadingImage &&
                    <div className={classes.imageSpinner} />
                }
                <img
                    className={classes.img}
                    onLoad={() => setLoadingImage(false)}
                    onError={() => setLoadingImage(false)}
                    loading="lazy"
                    src={property?.images[0]?.secure_url || altImage}
                />
            </div>
            <div className={classes.info}>
                <p>العنوان: {property.title}</p>
                <p>النوع: {property.propertyType}</p>
                <p>الهدف: {property.purpose}</p>
                <p>الموقع: {property.region.city.name},{property.region.name}</p>
            </div>
            <div className={classes.info}>
                <p>الاشتراك: {property.subscription}</p>
                <p>معلومات الاتصال: {property.contactInfo}</p>
                <p>الحالة: {property.state}</p>
                <p>تاريخ النشر: {createdAt}</p>
            </div>
        </div>
        <div className={classes.buttons}>
            <Link href={`/dashboard/properties/${property.id}`}
                className={classes.viewBtn}
            >عرض العقار</Link>
            <Select
                options={[
                    { value: "ACCEPT", label: "ACCEPT" },
                    { value: "REJECT", label: "REJECT" },
                    { value: "PEND", label: "PEND" },
                ]}
                styles={{
                    control: (base) => ({
                        ...base, width: "200px", cursor: "pointer",
                        backgroundColor: "#FFFFB1"
                    })
                }}
                value={selected}
                onChange={(selectedOption) => {
                    setSelected(selectedOption);
                }}
            />
            <button disabled={disabledSave || mutation.isPending}
                className={classes.saveBtn}
                onClick={saveHandler}
            >
                {mutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </button>
        </div>
    </div>
};
export default PropertyContainer;