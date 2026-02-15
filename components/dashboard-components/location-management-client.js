"use client"
import classes from "./location-management-client.module.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import AddLocationModal from "./add-location-modal";
import { deleteCityServer, deleteGovernorateServer, deleteRegionServer } from "@/app/dashboard/location-management/mutate";
import Loading from "../loading/loading";
import ConfirmDelete from "./confirm-delete";
import Confirm from "../confirmcomponent/confirm";
import { useRouter } from "next/navigation";
const getUnit = (unit) => {
    switch (unit) {
        case "governorate": return [0, 1];
        case "city": return [2, 3];
        case "region": return [4, 5];
        default: return [0, 1];
    }
};

const getDisplayed = (unit) => {
    switch (unit) {
        case "governorate":
            return [
                { key: "id", label: "ID" },
                { key: "name", label: "المحافظة" },
                { key: "_count.cities", label: "عدد المدن" },
                { key: "delete", label: "" }
            ];
        case "city":
            return [
                { key: "id", label: "ID" },
                { key: "governorate", label: "المحافظة" },
                { key: "name", label: "المدينة" },
                { key: "_count.regions", label: "عدد المناطق" },
                { key: "delete", label: "" }
            ];
        case "region":
            return [
                { key: "id", label: "ID" },
                { key: "governorate", label: "المحافظة" },
                { key: "city", label: "المدينة" },
                { key: "name", label: "المنطقة" },
                { key: "delete", label: "" }
            ]
    }
};

const options = [
    { value: "governorate", label: "المحافظات" },
    { value: "city", label: "المدن" },
    { value: "region", label: "المناطق" },
];

const selectCustomStyles = {
    control: (base) => ({
        ...base, margin: "5px",
        width: "320px",
        height: "58px",
        cursor: "pointer",
        padding: "10px",
    }),
    option: (base, state) => ({
        ...base, color: "#252525", fontWeight: "900", fontFamily: "Tajawal", backgroundColor: state.isSelected ? "#AAC0D8" : state.isFocused ? "#79B5CD" : base.backgroundColor, cursor: "pointer"
    }),
    placeholder: (base) => ({
        ...base, color: "#252525", fontWeight: "900", fontFamily: "Tajawal"
    }),
    valueContainer: (base) => ({
        ...base, color: "#252525", fontWeight: "900", fontFamily: "Tajawal"
    })
};

const getSearchPlaceholder = (unit) => {
    switch (unit) {
        case "governorate": return "ابحث عن محافظة";
        case "city": return "ابحث عن مدينة";
        case "region": return "ابحث عن منطقة";
        default: return "ابحث عن محافظة"
    }
};

const getBtnText = (unit) => {
    switch (unit) {
        case "governorate": return "أضف محافظة";
        case "city": return "أضف مدينة";
        case "region": return "أضف منطقة";
        default: return "أضف محافظة";
    }
};

const getPages = (current, total) => {
    const pages = [];

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    if (current >= 4) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(current + 1, total - 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 3) pages.push("...");
    pages.push(total);
    return pages;
};
const LocationManagementClient = ({ locations }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [unit, setUnit] = useState({ value: "governorate", label: "المحافظات" });
    const [searchText, setSearchText] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [displayedUnit, setDisplayedUnit] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const unitIndex = getUnit(unit.value)[0];
    const unitCountIndex = getUnit(unit.value)[1];

    const chosenUnit = locations[unitIndex];
    const chosenUnitCount = locations[unitCountIndex];

    const cols = getDisplayed(unit.value);
    const placeholder = getSearchPlaceholder(unit.value);

    const btntext = getBtnText(unit.value);

    const unitsPerPage = 15;
    const totalPages = Math.ceil(chosenUnitCount / unitsPerPage);
    const lastUnit = currentPage * unitsPerPage;
    const firstUnit = lastUnit - unitsPerPage;
    const pages = getPages(currentPage, totalPages);

    useEffect(() => {
        setDisplayedUnit(chosenUnit);
    }, [chosenUnit]);

    useEffect(() => {
        setCurrentPage(1);
        setDisplayedUnit([]);
        router.push(`/dashboard/location-management?key=${unit.value}&page=1`);
        router.refresh();
    }, [unit]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setDisplayedUnit([]);
            router.push(`/dashboard/location-management?key=${unit.value}&page=${currentPage - 1}`);
            setCurrentPage(prev => prev - 1);
        }
    };
    const handleNext = () => {
        if (currentPage < totalPages) {
            setDisplayedUnit([]);
            router.push(`/dashboard/location-management?key=${unit.value}&page=${currentPage + 1}`);
            setCurrentPage(prev => prev + 1);
        }
    };

    const searchChange = (e) => {
        setSearchText(e.target.value);
    };

    const searchHandler = () => {
        setDisplayedUnit([]);
        setCurrentPage(1);
        router.push(`/dashboard/location-management?key=${unit.value}&page=1&search=${searchText}`);
    };

    const showModal = () => {
        setShowAddModal(true);
    }

    const hideAddLocationModal = (res) => {
        setShowAddModal(false);
        if (res) setShowConfirm(true);
    }

    const deleteLocation = async (deleteId) => {
        switch (unit.value) {
            case "governorate":
                const resGov = await deleteGovernorateServer(deleteId);
                return resGov;
            case "city":
                const resCity = await deleteCityServer(deleteId);
                return resCity;
            case "region":
                const resRegion = await deleteRegionServer(deleteId);
                return resRegion;
            default: return;
        }
    }
    const deleteHandler = async () => {
        try {
            setLoading(true);
            const res = await deleteLocation(deleteId);
            setDisplayedUnit(prev => prev.filter(item => item.id !== deleteId));
            setDeleteId(null);
            setShowConfirmDelete(false);
            setShowConfirm(true);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const hideDelete = () => {
        setShowConfirmDelete(false);
        setDeleteId(null);
    };

    const hideConfirm = () => {
        setShowConfirm(false);
        router.refresh()
    }



    return <div className={classes.container}>
        {showConfirm && createPortal(<Confirm text="تم بنجاح ✓" unMount={hideConfirm} />, document.getElementById("feedback_modal_root"))}
        {showConfirmDelete && createPortal(<ConfirmDelete unMount={hideDelete} confirm={deleteHandler} />, document.getElementById("confirm_delete_modal"))}
        {showAddModal && createPortal(<AddLocationModal passedUnit={unit.value} locations={locations} unMount={hideAddLocationModal} updateUnit={setDisplayedUnit} />, document.getElementById("add_location_modal"))}
        {(loading || displayedUnit.length === 0) && createPortal(<Loading />, document.getElementById("loading_modal"))}
        <div className={classes.searchAndFilter}>
            <Select
                options={options}
                placeholder="اختر الموقع"
                value={unit}
                onChange={(chosen) => setUnit(chosen)}
                styles={selectCustomStyles}
            />
            <div className={classes.searchWrapper}>
                <input
                    className={classes.searchInput}
                    type="search"
                    placeholder={placeholder}
                    value={searchText}
                    onChange={searchChange}
                />
                <button className={classes.searchBtn} onClick={searchHandler}>ابحث</button>
            </div>
        </div>
        <div className={classes.addBtnContainer}>
            <button className={classes.addBtn} onClick={showModal}>
                {btntext} <img src="/assets/icons/add_icon/add.png" />
            </button>
            <p className={classes.count}>العدد كاملا : {chosenUnitCount}</p>
        </div>
        <table className={classes.table}>
            <thead>
                <tr>{cols.map(col => <th key={col.key}>{col.label}</th>)}</tr>
            </thead>
            <tbody>
                {displayedUnit.map(row => <tr key={row.id}>
                    {cols.map(col => <th key={col.key}>
                        {(col.key.startsWith("_count") && unit.value === "governorate") && row._count?.cities}
                        {(col.key === "governorate" && unit.value === "city") && row.governorate?.name}
                        {(col.key === "governorate" && unit.value === "region") && row.city?.governorate?.name}
                        {(col.key === "city" && unit.value === "region") && row.city?.name}
                        {(col.key.startsWith("_count") && unit.value === "city") && row._count?.regions}
                        {(col.key === "delete") && <div className={classes.delete}><img src="/assets/icons/delete_icon/delete_icon.svg" onClick={() => { setShowConfirmDelete(true); setDeleteId(row.id); }} /></div>}
                        {(!col.key.startsWith("_count") && col.key !== "governorate" && col.key !== "city") && row[col.key]}
                    </th>)}
                </tr>)}
            </tbody>
        </table>
        <div className={classes.pagination_container}>
            <button className={classes.pagination_btn} onClick={handleNext}>
                <img src="/assets/icons/next_icon/Next.svg" alt="" />
            </button>
            <div className={classes.pagination_nums} dir="ltr">
                {pages.map((page, index) => <p
                    key={index}
                    className={`${Number(page) ? classes.pagination_nums_p : ""} ${(currentPage === page && Number(page)) ? classes.page_chosen : ""}`}
                    onClick={() => {
                        if (Number(page)) {
                            setCurrentPage(page);
                            setDisplayedUnit([]);
                            router.push(`/dashboard/location-management?key=${unit.value}&page=${page}`);
                        }
                    }}
                    style={{ width: Number(page) > 99 ? "48px" : "36px" }}
                >
                    {page}
                </p>)}
            </div>
            <button className={classes.pagination_btn} onClick={handlePrevious}>
                <img src="/assets/icons/previous_icon/Prev.svg" alt="" />
            </button>
        </div>
    </div>
};
export default LocationManagementClient;