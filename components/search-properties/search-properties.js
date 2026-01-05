"use client"
import classes from "./search-properties.module.css";
import { useEffect, useState } from "react";
import Property from "../property/property";
import SearchFilter from "../searchfilter/searchfilter";


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

const SearchProperties = ({ fetchedProperties }) => {
    const [properties, setProperties] = useState([]);
    const [originalProperties, setOriginalProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const propertiesPerPage = 15;
    const totalPages = Math.ceil(properties.length / propertiesPerPage);
    const lastProperty = currentPage * propertiesPerPage;
    const firstProperty = lastProperty - propertiesPerPage;
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
        setProperties(fetchedProperties);
        setOriginalProperties(fetchedProperties);
    }, [fetchedProperties]);

    const orderHandler = (method) => {
        console.log(method);
        let newProperties = [];
        switch (method) {
            case "priceasc":
                newProperties = [...properties].sort((a, b) => a.price - b.price);
                setProperties(newProperties);
                return;
            case "pricedesc":
                newProperties = [...properties].sort((a, b) => b.price - a.price);
                setProperties(newProperties);
                return;
            case "dateasc":
                newProperties = [...properties].sort((a, b) => new Date(a.date) - new Date(b.date));
                setProperties(newProperties);
                return;
            case "datedesc":
                newProperties = [...properties].sort((a, b) => new Date(b.date) - new Date(a.date));
                setProperties(newProperties);
                return;
            default:
        }
        setProperties(originalProperties);
    };

    return <div className="w-full flex flex-col justify-start items-start">
        <SearchFilter order={orderHandler} />
        <div className="flex justify-center gap-x-12 gap-y-12 w-full my-12 flex-wrap">
            {properties.slice(firstProperty, lastProperty).map(property =>
                <Property key={property.id} {...property} />
            )}
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
    </div>;
};
export default SearchProperties;