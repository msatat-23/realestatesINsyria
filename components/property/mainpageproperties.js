"use client"
import { Fragment, useEffect, useState } from "react";
import Property from "./property";
import classes from "./mainpageproperties.module.css";
import ShowMorePropertiesBtn from "../bigbutton/bigbutton";
import { getMorePropertiesServer } from "@/app/addproperty/[id]/get-data";
import Loading from "../loading/loading";


const Mainpageproperties = ({ properties }) => {
    const [more, setMore] = useState(0);
    const [addedProperties, setAddedProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMore = async () => {
            try {
                setLoading(true);
                const res = await getMorePropertiesServer(more);
                console.log(res);
                if (res.ok) {
                    setAddedProperties([...res.exclusive, ...res.premium]);
                }
            } catch (e) {
                console.log("فشل ", e);
            } finally {
                setLoading(false);
            }
        };
        if (more > 0) {
            fetchMore();
        }
    }, [more]);

    return (
        <Fragment>
            <div className={classes.group}>
                {properties.exclusive.map((property) => (
                    <Property
                        key={property.id}
                        {...property}
                    />
                ))}
            </div>
            <div className={classes.group}>
                {properties.special.map((property) => (
                    <Property
                        key={property.id}
                        {...property}
                    />
                ))}
            </div>
            {addedProperties.length > 0 &&
                <div className={classes.group}>
                    {addedProperties.map((property) => (
                        <Property
                            key={property.id}
                            {...property}
                        />
                    ))}
                </div>
            }
            <ShowMorePropertiesBtn showMore={() => { setMore(prev => prev + 6) }} />
            {loading && <Loading />}
        </Fragment>
    );
};

export default Mainpageproperties;
