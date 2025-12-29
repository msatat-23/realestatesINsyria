"use client"
import { useEffect, useState } from "react";
import Property from "../property/property";
import SearchFilter from "../searchfilter/searchfilter";
import Loading from "../loading/loading";


const SearchProperties = ({ fetchedProperties }) => {
    const [properties, setProperties] = useState([]);
    const [originalProperties, setOriginalProperties] = useState([]);


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
            {properties.map(property =>
                <Property key={property.id} {...property} />
            )}
        </div>
    </div>;
};
export default SearchProperties;