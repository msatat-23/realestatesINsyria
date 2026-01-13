"use client"
import { useEffect, useState } from "react";
import classes from "./view-user.module.css";
import { getAllUserDataForAdminServer, getAllUserPropertiesForAdminServer } from "@/app/dashboard/users/server-actions";
import PropertyContainer from "./property-container";
import Select from "react-select";

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

const ViewUserModal = ({ id, unMount }) => {
    const [userData, setUserData] = useState({});
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selected, setSelected] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedProperties, setDisplayedProperties] = useState([]);

    const propertiesPerPage = 10
    const lastProperty = currentPage * propertiesPerPage;
    const firstProperty = lastProperty - propertiesPerPage;
    const totalPages = Math.ceil(displayedProperties.length / propertiesPerPage);

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
        setDisplayedProperties(properties);
    }, [properties]);

    useEffect(() => {
        const fetchUserData = async (id) => {
            try {
                setLoading(true);
                const res = await getAllUserDataForAdminServer(id);
                setUserData(res);
            } catch (e) {
                console.log(e);
            }
        };
        const fetchUserProperties = async (id) => {
            try {
                setLoading(true);
                const res = await getAllUserPropertiesForAdminServer(id);
                console.log(JSON.parse(res))
                setProperties(JSON.parse(res));
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData(id);
        fetchUserProperties(id);
    }, [id]);

    const searchHandler = (e) => {
        setSearchText(e.target.value);
        applyFilters(e.target.value, selected?.value);
    };

    const orderHandler = (option) => {
        setSelected(option);
        applyFilters(searchText, option?.value);
    };

    const applyFilters = (search, order) => {
        let result = [...properties];
        if (search) {
            result = result.filter(property =>
                property.title.toLowerCase().includes(search.toLowerCase()));
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
        setDisplayedProperties(result);
        setCurrentPage(1);
    };

    return <div className={classes.back_overlay} onClick={unMount}>
        <div className={classes.container} onClick={(e) => e.stopPropagation()}>
            <button
                onClick={unMount}
                className={classes.closeBtn}
                aria-label="إغلاق" >
                ✕
            </button>
            <div className={classes.topSection}>
                <img src={userData.image ? userData.image : '/assets/pics/userpic/profile-user.png'} alt="User" className={classes.userImage} />
                <div className={classes.basicInfo}>
                    <h2>{userData.firstName} {userData.lastName}</h2>
                    <p className={classes.username}>{userData.username}</p>
                    <p className={classes.email}>{userData.email} 📧</p>
                    <p className={classes.phone}>{userData.phone} 📞</p>
                    <p className={classes.joined}> عضو منذ: {new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} 📅</p>
                    <p className={classes.subscription}>نوع الاشتراك: {userData.subscription}</p>
                </div>
            </div>
            <div className={classes.search_filter}>
                <input
                    className={classes.searchInput}
                    type="search"
                    placeholder="ابحث عن عقار لهذا المستخدم"
                    value={searchText}
                    onChange={searchHandler}
                />
                <Select
                    styles={{
                        control: (base) => ({
                            ...base,
                            width: "300px",
                            height: "53px",
                            cursor: "pointer",
                            backgroundColor: "#F5F5F5"
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
                <h3>عقارات المستخدم</h3>
                <div className={classes.propertiesGrid}>
                    {properties && properties.length > 0 ? (
                        displayedProperties.slice(firstProperty, lastProperty).map((property) => (
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
            {loading && <div className={classes.overlay}>
                <div className={classes.spinner}></div>
                <p>جاري التحميل</p>
            </div>}
        </div>
    </div>
};
export default ViewUserModal;