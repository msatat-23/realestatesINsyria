"use client"
import { useEffect, useState } from "react";
import classes from "./properties.module.css";
import Select from "react-select";
import PropertyContainer from "./property-container";
import Loading from "../loading/loading";
import { createPortal } from "react-dom";

import {
    useQuery
} from "@tanstack/react-query";
import Confirm from "../confirmcomponent/confirm";


const options = [
    { value: "desc", label: "الأحدث" },
    { value: "asc", label: "الأقدم" },
];
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
const PropertiesClient = ({ total }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState({ value: "desc", label: "الأحدث" });
    const [loading, setLoading] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState(false);

    const propertiesPerPage = 15;
    const totalPages = Math.ceil(total / propertiesPerPage);

    const pages = getPages(currentPage, totalPages);


    useEffect(() => {
        console.log(currentPage)
    }, [currentPage])

    const { data, isFetching } = useQuery({
        queryKey: ["properties", currentPage, searchQuery, selected],
        queryFn: async () => {
            const res = await fetch(`/api/properties?page=${currentPage}&search=${searchQuery}&filter=${selected.value}`);
            if (!res.ok) {
                throw new Error(res.status.toString());
            }
            return res.json();
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selected]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const searchHandler = (e) => {
        setSearchText(e.target.value);
    };

    const orderHandler = (chosen) => {
        setSelected(chosen);
    };

    const hideConfirm = () => {
        setShowConfirm(false);
        setConfirmText("");
    };

    const triggerSearch = () => {
        setSearchQuery(searchText);
    };


    return <div className={classes.container}>
        <div className={classes.search_filter}>
            <div className={classes.searchWrapper}>
                <input
                    className={classes.searchInput}
                    type="search"
                    placeholder="ابحث عن عقار"
                    value={searchText}
                    onChange={searchHandler}
                />
                <button className={classes.searchBtn} onClick={triggerSearch}>ابحث</button>
            </div>
            <Select
                styles={{
                    control: (base) => ({
                        ...base,
                        width: "300px",
                        height: "53px",
                        cursor: "pointer"
                    })
                }}
                value={selected || null}
                onChange={(selected) => {
                    orderHandler(selected || "");
                }}
                placeholder="ترتيب حسب"
                options={options}
                isClearable
            />
        </div>
        <div className={classes.propertiesSection}>
            <div className={classes.propertiesGrid}>
                {data && data.length > 0 ? (
                    data.map((property) => (
                        <PropertyContainer key={property.id} property={property} />
                    ))
                ) : (
                    <p>لا توجد عقارات بعد.</p>
                )}
            </div>
        </div>
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
                        }
                    }}
                >
                    {page}
                </p>)}
            </div>
            <button className={classes.pagination_btn} onClick={handlePrevious}>
                <img src="/assets/icons/previous_icon/Prev.svg" alt="" />
            </button>
        </div>
        {showConfirm && createPortal(<Confirm text={confirmText} unMount={hideConfirm} />, document.getElementById("feedback_modal_root"))}
        {(loading || isFetching) && createPortal(<Loading />, document.getElementById("loading_modal"))}
    </div>
};
export default PropertiesClient;