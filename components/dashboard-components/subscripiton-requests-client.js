"use client"
import { useEffect, useState } from "react";
import classes from "./subscripiton-requests-client.module.css";
import Select from "react-select";
import SubscriptionRequestContainer from "./subscription-request-container";
import { useQuery } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import Loading from "../loading/loading";


const getPages = (current, total) => {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    if (current > 4) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++)pages.push(i);
    if (current < total - 3) pages.push("...");
    pages.push(total);
    return pages;
};

const options = [
    { value: "desc", label: "الأحدث" },
    { value: "asc", label: "الأقدم" },
];


const SubscriptionRequestsClient = ({ total }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [querySearch, setQuerySearch] = useState("");
    const [selected, setSelected] = useState({ value: "desc", label: "الأحدث" });


    const requestsPerPage = 3;
    const totalPages = Math.ceil(total / requestsPerPage);

    const pages = getPages(currentPage, totalPages);

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

    const orderHandler = (option) => {
        setSelected(option);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [querySearch, selected]);

    const { data, isFetching } = useQuery({
        queryKey: ["subscriptionRequests", currentPage, querySearch, selected?.value],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/subRequests?page=${currentPage}&search=${querySearch}&filter=${selected?.value}`,
                    { method: "GET", headers: { "Accept": "application/json" } });
                return res.json();
            } catch (e) {
                console.log(e);
            }
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
    });

    const triggerSearch = () => {
        setQuerySearch(searchText);
    };

    return <div className={classes.container}>
        <div className={classes.search_filter}>
            <div className={classes.searchWrapper}>
                <input
                    className={classes.searchInput}
                    type="search"
                    placeholder="ابحث عن الطلبات باستخدام اسم المستخدم"
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
        <div className={classes.requests_list}>
            {data && data.length > 0 && data.map(request => {
                return <SubscriptionRequestContainer key={request.id} request={request} />
            })}
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
        {isFetching && createPortal(<Loading />, document.getElementById("loading_modal"))}
    </div>
};
export default SubscriptionRequestsClient;