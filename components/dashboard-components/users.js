"use client"
import Link from "next/link";
import classes from "./users.module.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import { createPortal } from "react-dom";
import ViewUserModal from "./view-user";
const roleTranslater = {
    "USER": "مستخدم عادي",
    "ADMIN": "أدمن",
    "SUPERADMIN": "سوبر أدمن"
};

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


const UsersClient = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [viewUser, setViewUser] = useState(false);
    const [viewedUserId, setViewedUserId] = useState(null);

    const usersPerPage = 9;
    const lastUser = currentPage * usersPerPage;
    const firstUser = lastUser - usersPerPage;
    const totalPages = Math.ceil(displayedUsers.length / usersPerPage);

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
        setDisplayedUsers(users);
    }, [users]);

    const searchHandler = (e) => {
        setSearchText(e.target.value);
        applyFilters(e.target.value, selected?.value);
    };

    const orderHandler = (option) => {
        setSelected(option);
        applyFilters(searchText, option?.value);
    };

    const applyFilters = (search, order) => {
        let result = [...users];
        if (search) {
            result = result.filter(user =>
                user.username.toLowerCase().includes(search.toLowerCase()));
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
            case "propCountDesc":
                result.sort((a, b) =>
                    b._count.properties - a._count.properties);
                break;
            case "propCountAsc":
                result.sort((a, b) =>
                    a._count.properties - b._count.properties
                );
                break;
            default:
                break;
        }
        setDisplayedUsers(result);
        setCurrentPage(1);
    };

    const showUserHandler = (id) => {
        setViewUser(true);
        setViewedUserId(id);
    };

    const hideUserHandler = () => {
        setViewUser(false);
        setViewedUserId(null);
    };

    return <div className={classes.users_client}>
        <div className={classes.search_filter}>
            <input
                className={classes.searchInput}
                type="search"
                placeholder="ابحث عن مستخدم باستخدام اسم المستخدم"
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
            {displayedUsers.slice(firstUser, lastUser).map(user => <div key={user.id} className={classes.user}>
                <p className={classes.username}>{user.username}</p>
                <div className={classes.user_info}>
                    <p>الوظيفة : <span>{roleTranslater[user.role]}</span></p>
                    <p>عدد العقارات : <span>{user._count.properties}</span></p>
                </div>
                <button className={classes.viewbtn} onClick={() => { showUserHandler(user.id) }}>عرض المستخدم</button>
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
        {viewUser && createPortal(<ViewUserModal id={viewedUserId} unMount={hideUserHandler} />, document.getElementById("view_user_modal_root"))}
    </div>
};
export default UsersClient;