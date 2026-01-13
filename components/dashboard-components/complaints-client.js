"use client"
import classes from "./complaints-client.module.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import { markReadServer } from "@/app/dashboard/complaints/mutate";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Loading from "../loading/loading";
import { useAdminContext } from "./listen";
import { useQuery } from "@tanstack/react-query";

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
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++)pages.push(i);
    if (current < total - 3) pages.push("...");
    pages.push(total);
    return pages;
};


const ComplaintsClient = ({ total }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [querySearch, setQuerySearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);


    const complaintsPerPage = 3;
    const totalPages = Math.ceil(total / complaintsPerPage);

    const router = useRouter();
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

    const markReadHandler = async (id) => {
        try {
            setLoading(true);
            const res = await markReadServer(id);
            if (res.ok) {
                router.refresh();
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const triggerSearch = () => {
        setQuerySearch(searchText);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [querySearch, selected]);

    const { data, isFetching } = useQuery({
        queryKey: ["complaints", currentPage, querySearch, selected?.value],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/complaints?page=${currentPage}&search=${querySearch}&filter=${selected?.value}`,
                    { method: "GET", headers: { "Accept": "application/json" } });
                return res.json();
            } catch (e) {
                console.log(e);
            }
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
    });

    return <div className={classes.users_client}>
        {(loading || isFetching) && createPortal(<Loading />, document.getElementById("loading_modal"))}
        <div className={classes.search_filter}>
            <div className={classes.searchWrapper}>
                <input
                    className={classes.searchInput}
                    type="search"
                    placeholder="ابحث عن  شكوى حسب اسم المستخدم"
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
        <div className={classes.users}>
            {data && data.length > 0 && data.map(complaint => <div key={complaint.id} className={classes.user}>
                <p className={classes.user_name}>الاسم: {complaint.name}</p>
                <p className={classes.user_email}>الايميل: {complaint.email}</p>
                <p className={classes.type}>نوع الشكوى : {complaint.complaintType}</p>
                <p className={classes.user_message}>الرسالة: {complaint.description}</p>
                {complaint.propertyId && <p className={classes.p}>كود العقار: {complaint.propertyId}</p>}
                <p className={classes.user_date}>تاريخ الإنشاء: {new Date(complaint.createdAt).toLocaleDateString("ar-EG")}</p>
                <p className={classes.user_name}>مقروء: {complaint.readByAdmin ? "TRUE" : "FALSE"}</p>
                <button className={classes.markread} disabled={complaint.readByAdmin} onClick={() => { markReadHandler(complaint.id) }}>تعليم كمقروء</button>
            </div>)}
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
    </div>
};
export default ComplaintsClient;