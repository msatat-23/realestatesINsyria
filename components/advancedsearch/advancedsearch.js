import classes from './advancedsearch.module.css';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '@/store/advancedsearchSlice';
import { useRouter, usePathname } from 'next/navigation';
import { getStartingData, getCities, getRegions } from '@/app/addproperty/[id]/get-data';
const customStyles = {
    control: (base) => ({
        ...base,
        minHeight: '48px',
        height: '48px',
        background: 'linear-gradient(to bottom right, #ffffff, #f6f3ed)',
        margin: '-40px 0'
    }),
};

const AdvancedSearch = (props) => {
    const [Property_Status_Options, setPropertyStatusOptions] = useState([]);
    const [Property_Types, setPropertyTypes] = useState([]);
    const [Governorates, setGovernorates] = useState([]);
    const [Cities, setCities] = useState([]);
    const [Regions, setRegions] = useState([]);
    const [allCities, setallCities] = useState([]);
    const [Loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const pathName = usePathname();
    const reduxstate = useSelector(state => state.advancedsearch);

    useEffect(() => {
        console.log(reduxstate);
    }, [reduxstate]);

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
        if (reduxstate.governorate) {
            const fetchcities = async () => {
                try {
                    setLoading(true);
                    const res = await getCities(reduxstate.governorate.value);
                    const formatted = res.map(item => ({ value: item.id, label: item.name }));
                    setallCities(formatted);
                    const maincity = formatted.find(item => item.label === reduxstate.governorate.label);
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
    }, [reduxstate.governorate]);
    useEffect(() => {
        if (reduxstate.city) {
            const fetchregions = async () => {
                try {
                    setLoading(true);
                    const res = await getRegions(reduxstate.city.value);
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
    }, [reduxstate.city]);




    const SubmissionHandler = (e) => {
        e.preventDefault();
        dispatch(updateField({ field: 'q', value: '' }));
        console.log('trying to submit ');
        const params = new URLSearchParams();
        Object.entries({
            q: reduxstate.q || "",
            minprice: reduxstate.min_price || "",
            maxprice: reduxstate.max_price || "",
            governorate: reduxstate.governorate?.label || "",
            city: reduxstate.city?.label || "",
            region: reduxstate.region?.label || "",
            type: reduxstate.property_type || "",
            purpose: reduxstate.property_status || "بيع",
            minarea: reduxstate.min_area || "",
            maxarea: reduxstate.max_area || "",
            minrooms: reduxstate.minroomsNum || "",
            maxrooms: reduxstate.maxroomsNum || "",
            floor: reduxstate.floor || ""
        }).forEach(([key, value]) => {
            if (value) params.set(key, value)
        });
        router.push(`/search?${params.toString()}`);
        if (pathName.startsWith("/search")) props.hide();
    };
    return (
        <div className={classes.overlay} onClick={props.hide} >
            <div className={classes.container} onClick={(e) => e.stopPropagation()}>
                <img src='/assets/icons/exit/no.png' className={classes.exit} onClick={props.hide} />
                <form className={classes.form} onSubmit={SubmissionHandler}>
                    <Select
                        styles={customStyles}
                        options={Property_Status_Options}
                        className={`${classes.wideselect} ${classes.common}  `}
                        value={Property_Status_Options.find(option => option.label === reduxstate.property_status) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'property_status', value: selectedOption ? selectedOption.label : '' }));
                        }}
                        placeholder='حالة العقار'
                        isClearable={true}
                    />
                    <Select
                        styles={customStyles}
                        options={Property_Types}
                        className={`${classes.wideselect} ${classes.common}  `}
                        value={Property_Types.find(option => option.label === reduxstate.property_type) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'property_type', value: selectedOption ? selectedOption.label : '' }));
                        }}
                        placeholder='نوع العقار'
                        isClearable={true}
                    />
                    <Select
                        styles={customStyles}
                        options={Governorates}
                        className={`${classes.wideselect} ${classes.common}  `}
                        value={Governorates.find(option => option.label === reduxstate.governorate.label) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'governorate', value: selectedOption ? selectedOption : '' }));
                        }}
                        placeholder='المحافظة'
                        isClearable={true}
                    />
                    <Select
                        styles={customStyles}
                        options={Cities}
                        className={`${classes.wideselect} ${classes.common}  `}
                        value={Cities.find(option => option.label === reduxstate.city.label) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'city', value: selectedOption ? selectedOption : '' }));
                        }}
                        placeholder='المدينة'
                        onInputChange={(inputValue) => {
                            if (inputValue) {
                                const filtered = allCities.filter((city) =>
                                    city.label.startsWith(inputValue)
                                ).slice(0, 20);
                                setCities(filtered);
                            }
                            else {
                                const maincity = allCities.find(item => item.label === reduxstate.governorate.label);
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
                        className={`${classes.wideselect} ${classes.common}  `}
                        value={Regions.find(option => option.label === reduxstate.region.label) || null}
                        onChange={(selectedOption) => {
                            dispatch(updateField({ field: 'region', value: selectedOption ? selectedOption : '' }));
                        }}
                        placeholder='المنطقة'
                        isClearable={true}
                    />
                    <div className={classes.inputs}>
                        <div className={classes.inputwrapper}>
                            <input type='text' placeholder='الحد الأدنى للسعر' value={reduxstate.min_price} onChange={(e) => dispatch(updateField({ field: 'min_price', value: e.target.value }))} className={classes.wrapped} />
                            {reduxstate.min_price && <span className={classes.unit}>$</span>}
                        </div>
                        <div className={classes.inputwrapper}>
                            <input type='text' placeholder='الحد الأعلى للسعر' value={reduxstate.max_price} onChange={(e) => dispatch(updateField({ field: 'max_price', value: e.target.value }))} className={classes.wrapped} />
                            {reduxstate.max_price && <span className={classes.unit}>$</span>}
                        </div>
                        <div className={classes.inputwrapper}>
                            <input type='text' placeholder='الحد الأدنى للمساحة' value={reduxstate.min_area} onChange={(e) => dispatch(updateField({ field: 'min_area', value: e.target.value }))} className={classes.wrapped} />
                            {reduxstate.min_area && <span className={classes.unit}>م²</span>}
                        </div>
                        <div className={classes.inputwrapper}>
                            <input type='text' placeholder='الحد الأعلى للمساحة' value={reduxstate.max_area} onChange={(e) => dispatch(updateField({ field: 'max_area', value: e.target.value }))} className={classes.wrapped} />
                            {reduxstate.max_area && <span className={classes.unit}>م²</span>}
                        </div>
                        <input type='text' placeholder='الحد الأدنى لعدد الغرف' value={reduxstate.minroomsNum} onChange={(e) => dispatch(updateField({ field: 'minroomsNum', value: e.target.value }))} className={classes.smallinput} />
                        <input type='text' placeholder='الحد الأعلى لعدد الغرف' value={reduxstate.maxroomsNum} onChange={(e) => dispatch(updateField({ field: 'maxroomsNum', value: e.target.value }))} className={classes.smallinput} />
                        <input type='text' placeholder='الطابق' value={reduxstate.floor} onChange={(e) => dispatch(updateField({ field: 'floor', value: e.target.value }))} className={classes.smallinput} />
                        <input type='submit' value={`بحث`} className={classes.submit} />
                    </div>
                </form>
                {Loading && <div className={classes.overlay2}>
                    <div className={classes.spinner}></div>
                    <p>جار التحميل...</p>
                </div>}
            </div>
        </div>
    );
}

export default AdvancedSearch;




