"use client"
import { useEffect, useState } from "react";
import classes from "./subscripiton-requests-client.module.css";
import Select from "react-select";
import SubscriptionRequestContainer from "./subscription-request-container";


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


const SubscriptionRequestsClient = ({ subscriptionRequests }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [displayedRequests, setDisplayedRequests] = useState([]);
    const [selected, setSelected] = useState(null);


    const requestsPerPage = 9;
    const lastRequest = currentPage * requestsPerPage;
    const firstRequest = lastRequest - requestsPerPage;
    const totalPages = Math.ceil(displayedRequests.length / requestsPerPage);

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
        setDisplayedRequests(subscriptionRequests);
    }, [subscriptionRequests]);

    const searchHandler = (e) => {
        setSearchText(e.target.value);
        applyFilters(e.target.value, selected?.value);
    };

    const orderHandler = (option) => {
        setSelected(option);
        applyFilters(searchText, option?.value);
    };

    const applyFilters = (search, order) => {
        let result = [...subscriptionRequests];
        if (search) {
            result = result.filter(request =>
                request?.user?.username.toLowerCase().includes(search.toLowerCase()));
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
        setDisplayedRequests(result);
        setCurrentPage(1);
    };


    return <div className={classes.container}>
        <div className={classes.search_filter}>
            <input
                className={classes.searchInput}
                type="search"
                placeholder="ابحث عن الطلبات باستخدام اسم المستخدم"
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
        <div className={classes.requests_list}>
            {displayedRequests.slice(firstRequest, lastRequest).map(request => {
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
    </div>
};
export default SubscriptionRequestsClient;