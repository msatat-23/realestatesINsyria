'use client'
import classes from './searchfilter.module.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '@/store/advancedsearchSlice';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { getStartingData, getCities, getRegions } from '@/app/addproperty/[id]/get-data';
const customStyles = {
    control: (base) => ({
        ...base,
        minHeight: '53px',
        height: '53px',
        background: 'linear-gradient(to bottom right, #ffffff, #f6f3ed)'
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: '220px',
        overflowY: 'auto',
    }),
};

const customorderStyles = {
    control: (base) => ({
        ...base,
        borderRadius: '8px',
        padding: '5px 10px',
        fontSize: '16px',
        borderColor: '#ccc',
        direction: 'rtl',
        width: '320px'
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected ? '#0070f3' : isFocused ? '#f0f0f0' : 'white',
        color: isSelected ? 'white' : 'black',
        direction: 'rtl',
    }),
    placeholder: (base) => ({
        ...base,
        direction: 'rtl',
    }),
    singleValue: (base) => ({
        ...base,
        direction: 'rtl',
    }),
};

const SearchFilter = ({ order }) => {
    const [Governorates, setGovernorates] = useState([]);
    const [allCities, setallCities] = useState([]);
    const [Cities, setCities] = useState([]);
    const [Regions, setRegions] = useState([]);
    const [PropertyTypes, setPropertyTypes] = useState([]);
    const [PropertyStatusOptions, setPropertyStatusOptions] = useState([]);
    const [SelectedFilter, setSelectedFilter] = useState('');
    const [Loading, setLoading] = useState(false);
    const router = useRouter();
    const reduxfilters = useSelector(state => state.advancedsearch);
    const dispatch = useDispatch();
    const initialPurposeRef = useRef(null);

    useEffect(() => {
        if (initialPurposeRef.current === null) {
            initialPurposeRef.current = reduxfilters.property_status;
        }
    }, []);



    const filters = [
        { key: 'price', label: 'السعر' },
        { key: 'location', label: 'الموقع' },
        { key: 'property_type', label: 'نوع العقار' },
        { key: 'property_status', label: 'حالة العقار' },
        { key: 'area', label: 'المساحة' },
        { key: 'rooms', label: 'عدد الغرف' },
    ];

    const orderfilters = [
        { value: 'priceasc', label: 'السعر من الأدنى إلى الأعلى' },
        { value: 'pricedesc', label: 'السعر من الأعلى إلى الأدنى' },
        { value: 'dateasc', label: 'التاريخ من الأقدم إلى الأحدث' },
        { value: 'datedesc', label: 'التاريخ من الأحدث إلى الأقدم' },
    ];

    console.log("property_status : ", reduxfilters.property_status);

    const Empty = () => {
        const { q, property_status, ...rest } = reduxfilters;
        return Object.values(rest).every(value => value === "") &&
            (initialPurposeRef.current == property_status);
    };

    const filterContainer = () => {
        switch (SelectedFilter) {
            case 'price':
                return (
                    <div className={`${classes.container} ${classes.side}`} >
                        <input type="number" placeholder='الحد الأدنى للسعر' className={classes.input} onChange={(e) => { dispatch(updateField({ field: 'min_price', value: e.target.value })) }} value={reduxfilters.min_price || ''} />
                        <input type='number' placeholder='الحد الأعلى للسعر' className={classes.input} onChange={(e) => { dispatch(updateField({ field: 'max_price', value: e.target.value })) }} value={reduxfilters.max_price || ''} />
                        <button onClick={() => { setSelectedFilter('') }} className={classes.setbutton}>تحديد</button>
                    </div>
                );

            case 'location':
                return <div className={classes.container} >
                    <Select
                        styles={customStyles}
                        options={Governorates}
                        className={classes.select}
                        value={Governorates.find(option => option.label === reduxfilters.governorate.label) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'governorate', value: selectedOption ? selectedOption : '' }));
                        }}
                        placeholder='المحافظة'
                        isClearable={true}
                    />
                    <Select
                        styles={customStyles}
                        options={Cities}
                        className={classes.select}
                        value={Cities.find(option => option.label === reduxfilters.city.label) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'city', value: selectedOption ? selectedOption : '' }));
                        }}
                        placeholder='المدينة'
                        onInputChange={(inputValue) => {
                            if (inputValue) {
                                const filtered = allCities
                                    .filter((city) =>
                                        city.label.startsWith(inputValue)
                                    ).slice(0, 20);
                                setCities(filtered);
                            }
                            else {
                                const maincity = allCities.find(item => item.label === reduxfilters.governorate.label);
                                const restofcities = allCities.slice(0, 20).filter((item) => !maincity || item.label !== maincity.label);
                                setCities([maincity, ...restofcities].filter(Boolean));
                            }
                        }
                        }
                        isClearable={true}
                    />
                    <Select
                        styles={customStyles}
                        options={Regions}
                        className={classes.select}
                        value={Regions.find(option => option.label === reduxfilters.region.label) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'region', value: selectedOption ? selectedOption : '' }));
                        }}
                        placeholder='المنطقة'
                        isClearable={true}
                    />

                    <button onClick={() => { setSelectedFilter('') }} className={classes.setbutton}>تحديد</button>
                </div>;
            case 'property_type':
                return <div className={classes.container} >
                    <Select
                        styles={customStyles}
                        options={PropertyTypes}
                        className={classes.select}
                        value={PropertyTypes.find(type => type.label === reduxfilters.property_type) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'property_type', value: selectedOption ? selectedOption.label : '' }));
                        }}
                        placeholder='نوع العقار'
                        isClearable={true}
                    />
                    <button onClick={() => { setSelectedFilter('') }} className={classes.setbutton}>تحديد</button>
                </div>;
            case 'property_status':
                return <div className={classes.container}>
                    <Select
                        styles={customStyles}
                        options={PropertyStatusOptions}
                        className={classes.select}
                        value={PropertyStatusOptions.find(status => status.label === reduxfilters.property_status) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'property_status', value: selectedOption ? selectedOption.label : '' }));
                        }}
                        placeholder='حالة العقار'
                        isClearable={true}
                    />
                    <button onClick={() => { setSelectedFilter('') }} className={classes.setbutton}>تحديد</button>
                </div>;
            case 'area':
                return <div className={`${classes.container} ${classes.side}`} >
                    <input type="number" placeholder='الحد الأدنى للمساحة بالمتر ' className={classes.input} onChange={(e) => { dispatch(updateField({ field: 'min_area', value: e.target.value })) }} value={reduxfilters.min_area || ''} />
                    <input type="number" placeholder='الحد الأعلى للمساحة بالمتر ' className={classes.input} onChange={(e) => { dispatch(updateField({ field: 'max_area', value: e.target.value })) }} value={reduxfilters.max_area || ''} />
                    <button onClick={() => { setSelectedFilter('') }} className={classes.setbutton}>تحديد</button>
                </div>;
            case 'rooms':
                return <div className={classes.container} >
                    <input type="number" placeholder='الحد الأدنى لعدد الغرف' className={classes.input} onChange={(e) => { dispatch(updateField({ field: 'minroomsNum', value: e.target.value })) }} value={reduxfilters.minroomsNum || ''} />
                    <input type="number" placeholder='الحد الأعلى لعدد الغرف' className={classes.input} onChange={(e) => { dispatch(updateField({ field: 'maxroomsNum', value: e.target.value })) }} value={reduxfilters.maxroomsNum || ''} />
                    <button onClick={() => { setSelectedFilter('') }} className={classes.setbutton}>تحديد</button>
                </div>;
            default:
                return;
        }
    };

    const handleChange = (selectedOption) => {
        order(selectedOption?.value || "");
    };
    useEffect(() => {
        const fetchStartingData = async () => {
            try {
                setLoading(true);
                const res = await getStartingData();
                console.log(res);
                const formattedTypes = res.types.map(item => ({ value: item, label: item }));
                const formattedPurposes = res.purposes.map(item => ({ value: item, label: item }));
                const formattedGovernorates = res.governorates.map(item => ({ value: item.id, label: item.name }));
                setPropertyTypes(formattedTypes);
                setPropertyStatusOptions(formattedPurposes);
                setGovernorates(formattedGovernorates);
            }
            catch (error) {
                console.log('FETCHING STARTING DATA ERROR : ', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchStartingData();
    }, []);

    useEffect(() => {
        if (reduxfilters.governorate) {
            const fetchcities = async () => {
                try {
                    setLoading(true);
                    const res = await getCities(reduxfilters.governorate.value);
                    const formatted = res.map(item => ({ value: item.id, label: item.name }));
                    setallCities(formatted);
                    const maincity = formatted.find(item => item.label === reduxfilters.governorate.label);
                    const restofcities = formatted.slice(0, 20).filter((item) => !maincity || item.label !== maincity.label);
                    setCities([maincity, ...restofcities].filter(Boolean));
                    setLoading(false);
                }
                catch (error) {
                    console.log('خطأ في جلب مدن هذه المحافظة');
                    setLoading(false);
                }
            };
            fetchcities();
        }
        else {
            dispatch(updateField({ field: 'city', value: '' }));
            setCities([]);
            setallCities([]);
            dispatch(updateField({ field: 'region', value: '' }));
            setRegions([]);
        }
    }, [reduxfilters.governorate]);
    useEffect(() => {
        if (reduxfilters.city) {
            const fetchregions = async () => {
                try {
                    setLoading(true);
                    const res = await getRegions(reduxfilters.city.value);
                    const formatted = res.map(item => ({ value: item.id, label: item.name }));
                    setRegions(formatted);
                    setLoading(false);
                }
                catch (error) {
                    console.log('خطأ في جلب مناطق هذه المدينة');
                    setLoading(false);
                }
            };
            fetchregions();
        }
        else {
            dispatch(updateField({ field: 'region', value: '' }));
            setRegions([]);
        }
    }, [reduxfilters.city]);

    const handleFilter = () => {
        const params = new URLSearchParams();
        Object.entries({
            q: reduxfilters.q || "",
            minprice: reduxfilters.min_price || "",
            maxprice: reduxfilters.max_price || "",
            governorate: reduxfilters.governorate?.label || "",
            city: reduxfilters.city?.label || "",
            region: reduxfilters.region?.label || "",
            type: reduxfilters.property_type || "",
            purpose: reduxfilters.property_status || "بيع",
            minarea: reduxfilters.min_area || "",
            maxarea: reduxfilters.max_area || "",
            minrooms: reduxfilters.minroomsNum || "",
            maxrooms: reduxfilters.maxroomsNum || "",
            floor: reduxfilters.floor || ""
        }).forEach(([key, value]) => {
            if (value) params.set(key, value)
        });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className={classes.searchfilter}>
            {(SelectedFilter !== '') && < div className={classes.overlay} onClick={() => { setSelectedFilter(''); }}></div>}
            <div className={classes.firstsection}>
                {filters.map(filter =>
                    <div key={filter.key} className={classes.filterandcontainer}>
                        <button className={classes.button} onClick={() => {
                            setSelectedFilter(filter.key);
                            console.log(`${filter.label} is set`);
                        }}>
                            {filter.label}
                        </button>
                        {(filter.key === SelectedFilter) && filterContainer()}
                    </div>)}
                <button className={classes.filterbutton} onClick={handleFilter} disabled={Empty()}>فلترة النتائج</button>
                <div style={{ width: '250px' }}>
                    <Select
                        options={orderfilters}
                        onChange={handleChange}
                        placeholder="ترتيب حسب"
                        styles={customorderStyles}
                        isRtl
                        isClearable
                    />
                </div>
            </div>
            {Loading && <div className={classes.overlay2}>
                <div className={classes.spinner}></div>
                <p>جار التحميل...</p>
            </div>}
        </div >
    );
}

export default SearchFilter;