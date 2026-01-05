"use client"
import { useEffect, useState } from "react";
import classes from "./add-location-modal.module.css";
import Select from "react-select";
import { createPortal } from "react-dom";
import Loading from "../loading/loading";
import { addCityServer, addGovernorateServer, addRegionServer } from "@/app/dashboard/location-management/mutate";


const getUnitReversed = (unit) => {
    switch (unit) {
        case "governorate": return [0, 1];
        case "city": return [2, 3];
        default: return [0, 1];
    }
};

const options = [
    { value: "governorate", label: "أضف محافظة" },
    { value: "city", label: "أضف مدينة" },
    { value: "region", label: "أضف منطقة" },
];

const getUnit = (unit) => {
    switch (unit) {
        case "governorate": return { value: "governorate", label: "أضف محافظة" };
        case "city": return { value: "city", label: "أضف مدينة" };
        case "region": return { value: "region", label: "أضف منطقة" };
        default: return { value: "governorate", label: "أضف محافظة" };
    }
};

const AddLocationModal = ({ passedUnit, locations, unMount, updateUnit }) => {
    const [selectUnit, setSelectUnit] = useState(null);
    const [unit, setUnit] = useState("governorate");
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");

    const [govs, setGovs] = useState([]);
    const [gov, setGov] = useState(null);

    const [allCities, setAllCities] = useState([]);
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {
        setUnit(passedUnit);
        setSelectUnit(getUnit(passedUnit));
    }, [passedUnit]);

    useEffect(() => {
        if (unit === "governorate") return;
        const unitIndex = getUnitReversed("governorate")[0];
        const formatted = locations[unitIndex].map(governorate => { return { value: governorate.id, label: governorate.name } });
        setGovs(formatted);
    }, [unit]);

    useEffect(() => {
        if (!gov || unit === "governorate") {
            setCity(null);
            setCities([]);
            setAllCities([]);
            return
        };
        const unitIndex = getUnitReversed("city")[0];
        const formatted = locations[unitIndex].filter(city => city.governorateId === gov.value).map(city => { return { value: city.id, label: city.name } });
        setAllCities(formatted);
        const maincity = formatted.find(city => city.label === gov.label);
        const rest = formatted.slice(0, 20).filter(city => !maincity || city.value !== maincity.value);
        setCities([maincity, ...rest].filter(Boolean));
    }, [gov]);




    const renderStructure = (unit) => {
        switch (unit) {
            case "governorate":
                return <input
                    type="text"
                    placeholder="اسم المحافظة"
                    value={text}
                    onChange={(e) => { setText(e.target.value) }}
                    className={classes.input}
                />;
            case "city":
                return <div className={classes.inputs}>
                    <Select
                        placeholder="اختر المحافظة"
                        options={govs}
                        value={gov || null}
                        onChange={(chosen) => setGov(chosen)}
                        styles={{
                            control: (base) => ({ ...base, width: "380px", height: "44px", cursor: "pointer", fontFamily: "Tajawal", fontWeight: "700", backgroundColor: "#FFFFF0", color: "#2c3e50" })
                        }}
                        isClearable
                    />
                    <input
                        type="text"
                        placeholder="اسم المدينة"
                        value={text}
                        onChange={(e) => { setText(e.target.value) }}
                        className={classes.input}
                    />
                </div>;
            case "region":
                return <div className={classes.inputs}>
                    <Select
                        placeholder="اختر المحافظة"
                        options={govs}
                        value={gov || null}
                        onChange={(chosen) => setGov(chosen)}
                        styles={{
                            control: (base) => ({ ...base, width: "380px", height: "44px", cursor: "pointer", fontFamily: "Tajawal", fontWeight: "700", backgroundColor: "#FFFFF0", color: "#2c3e50" })
                        }}
                        isClearable
                    />
                    <Select
                        placeholder="اختر المدينة"
                        options={cities}
                        value={city || null}
                        onChange={(chosen) => setCity(chosen)}
                        onInputChange={(input) => {
                            if (input.trim() !== "") {
                                const newCities = allCities.filter(city => city.label.startsWith(input));
                                const formatted = newCities.slice(0, 20);
                                setCities(formatted);
                            } else if (gov && unit === "region") {
                                const maincity = allCities.find(city => city.label === gov.label);
                                const rest = allCities.slice(0, 20).filter(city => !maincity || city.value !== maincity.value);
                                setCities([maincity, ...rest].filter(Boolean));
                            }
                        }}
                        styles={{
                            control: (base) => ({ ...base, width: "380px", height: "44px", cursor: "pointer", fontFamily: "Tajawal", fontWeight: "700", backgroundColor: "#FFFFF0", color: "#2c3e50" })
                        }}
                        isClearable
                    />
                    <input
                        type="text"
                        placeholder="اسم المنطقة"
                        value={text}
                        onChange={(e) => { setText(e.target.value) }}
                        className={classes.input}
                    />
                </div>;
        };
    };

    const addLocation = async () => {
        switch (unit) {
            case "governorate":
                if (text.trim() === "") {
                    setError("الرجاء إدخال اسم المحافظة"); return;
                }
                setError(null);
                const resGov = await addGovernorateServer(text.trim());
                if (unit === passedUnit) {
                    updateUnit(prev => [...prev, { id: resGov.data.id, name: resGov.data.name, _count: { cities: 0 } }]);
                }
                return resGov;
            case "city":
                if (!gov) {
                    setError("الرجاء اختيار المحافظة"); return;
                }
                if (text.trim() === "") {
                    setError("الرجاء إدخال اسم المدينة"); return;
                }
                setError(null);
                const resCity = await addCityServer(text.trim(), gov.value);
                return resCity;
            case "region":
                if (!gov) {
                    setError("الرجاء اختيار المحافظة"); return;
                }
                if (!city) {
                    setError("الرجاء اختيار المدينة"); return;
                }
                if (text.trim() === "") {
                    setError("الرجاء إدخال اسم المنطقة"); return;
                }
                setError(null);
                const resRegion = await addRegionServer(text.trim(), city.value);
                return resRegion;
            default: return;
        }
    };

    const addHandler = async () => {
        try {
            setLoading(true);
            const res = await addLocation();
            if (res.ok) {
                unMount(true);
            }
            console.log(res);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return <div className={classes.overlay} onClick={() => unMount(false)}>
        <div className={classes.container} onClick={(e) => { e.stopPropagation() }}>
            <div className={classes.header}>
                <h1 className={classes.h1}>إضافة موقع</h1>
                <Select
                    options={options}
                    value={selectUnit}
                    onChange={(chosen) => {
                        setSelectUnit(chosen);
                        setUnit(chosen.value)
                    }}
                    styles={{
                        control: (base) => ({ ...base, width: "180px", height: "44px", cursor: "pointer", fontFamily: "Tajawal", fontWeight: "700", backgroundColor: "#FFFFF0", color: "#2c3e50" })
                    }}
                />
            </div>
            {loading && createPortal(<Loading />, document.getElementById("loading_modal"))}
            <div className={classes.render_and_add}>
                {renderStructure(unit)}
                {error && <p className={classes.error}>{error}</p>}
                <div className={classes.btns}>
                    <button className={classes.addBtn} onClick={addHandler}>أضف الموقع</button>
                    <button className={classes.addBtn} onClick={() => unMount(false)}>إلغاء</button>
                </div>
            </div>
        </div>
    </div>
};
export default AddLocationModal;