"use client"
import classes from "./users.module.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import { createPortal } from "react-dom";
import ViewUserModal from "./view-user";
import UserContainer from "./user-container";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";

const options = [
    { value: "desc", label: "الأحدث" },
    { value: "asc", label: "الأقدم" },
    { value: "propCountDesc", label: "عدد العقارات من الأكثر إلى الأقل" },
    { value: "propCountAsc", label: "عدد العقارات من الأقل إلى الأكثر" },
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


const UsersClient = ({ total }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState({ value: "desc", label: "الأحدث" });
    const [viewUser, setViewUser] = useState(false);
    const [viewedUserId, setViewedUserId] = useState(null);


    const usersPerPage = 9;
    const lastUser = currentPage * usersPerPage;
    const firstUser = lastUser - usersPerPage;
    const totalPages = Math.ceil(total / usersPerPage);

    const pages = getPages(currentPage, totalPages);


    const { data, isFetching } = useQuery({
        queryKey: ["users", currentPage, searchQuery, selected?.value],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users?page=${currentPage}&search=${searchQuery}&filter=${selected.value}`,
                    { method: "GET", headers: { "Accept": "application/json" } });
                if (!res.ok) {
                    throw new Error(res.status.toString());
                }
                return res.json();
            } catch (e) {
                console.log(e);
            }
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
    });


    console.log(data);

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

    const hideUserHandler = () => {
        setViewUser(false);
        setViewedUserId(null);
    };

    const triggerSearch = () => {
        setSearchQuery(searchText);
    };

    return <div className={classes.users_client}>
        <div className={classes.search_filter}>
            <div className={classes.searchWrapper}>
                <input
                    className={classes.searchInput}
                    type="search"
                    placeholder="ابحث عن مستخدم باستخدام اسم المستخدم"
                    value={searchText}
                    onChange={searchHandler}
                    dir="rtl"
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
            {data && data.length > 0 &&
                data.map(user => <UserContainer key={user.id} user={user} setViewedUserId={setViewedUserId} setViewUser={setViewUser} />)}
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
        {viewUser && createPortal(<ViewUserModal id={viewedUserId} unMount={hideUserHandler} />, document.getElementById("view_user_modal_root"))}
    </div>
};
export default UsersClient;