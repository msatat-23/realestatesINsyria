"use client"
import classes from "./complaints-client.module.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import { markReadServer } from "@/app/dashboard/complaints/mutate";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Loading from "../loading/loading";
import { useAdminContext } from "./listen";

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
    if (current > 4) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++)pages.push(i);
    if (current < total - 3) pages.push("...");
    pages.push(total);
    return pages;
};


const ComplaintsClient = ({ complaints }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [displayedComplaints, setDisplayedComplaints] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const { fetchcount } = useAdminContext();

    const complaintsPerPage = 9;
    const lastComplaint = currentPage * complaintsPerPage;
    const firstComplaint = lastComplaint - complaintsPerPage;
    const totalPages = Math.ceil(displayedComplaints.length / complaintsPerPage);

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

    useEffect(() => {
        setDisplayedComplaints(complaints);
    }, [complaints]);

    const searchHandler = (e) => {
        setSearchText(e.target.value);
        applyFilters(e.target.value, selected?.value);
    };

    const orderHandler = (option) => {
        setSelected(option);
        applyFilters(searchText, option?.value);
    };

    const applyFilters = (search, order) => {
        let result = [...complaints];
        if (search) {
            result = result.filter(complaint =>
                complaint.name.toLowerCase().includes(search.toLowerCase()));
        }
        switch (order) {
            case "desc":
                result.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "asc":
                result.sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt));
                break;
            default:
                break;
        }
        setDisplayedComplaints(result);
        setCurrentPage(1);
    };

    const markReadHandler = async (id) => {
        try {
            setLoading(true);
            const res = await markReadServer(id);
            if (res.ok) {
                fetchcount();
                router.refresh();
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return <div className={classes.users_client}>
        {loading && createPortal(<Loading />, document.getElementById("loading_modal"))}
        <div className={classes.search_filter}>
            <input
                className={classes.searchInput}
                type="search"
                placeholder="ابحث عن  شكوى حسب اسم المستخدم"
                value={searchText}
                onChange={searchHandler}
            />
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
            {displayedComplaints.slice(firstComplaint, lastComplaint).map(complaint => <div key={complaint.id} className={classes.user}>
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