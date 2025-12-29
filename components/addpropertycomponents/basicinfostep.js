'use client'
import { Fragment, useEffect, useReducer, useState } from 'react';
import classes from './basicinfostep.module.css';
import Select from 'react-select';
import { Readex_Pro } from 'next/font/google';
import { getCities, getCity, getFullDetails, getGovernorate, getRegion, getRegions, getStartingData } from '@/app/addproperty/[id]/get-data';
import {
    validateTitle,
    validateDescription,
    validateArea,
    validateContact,
    validateFloor,
    validatePrice,
    validateRooms,
    validateStreet
} from '@/lib/validation/property-validators';
import { submitBasicPropertyData, updateBasicPropertyData } from '@/app/addproperty/[id]/send-data';
import { reverseToArabic } from '@/lib/constant-data-translater';
const customStyles = {
    control: (base) => ({
        ...base,
        minHeight: '53px',
        height: '53px',
        background: 'linear-gradient(to bottom right, #ffffff, #f6f3ed)'
    }),
};
const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });

const reversedTranslationMap = {
    "شرقي": "EAST",
    "غربي": "WEST",
    "جنوبي": "SOUTH",
    "شمالي": "NORTH",
    "بيع": "SALE",
    "إيجار": "RENT",
    "رهن": "MORTGAGE",
    "شقة": "APARTMENT",
    "فيلا": "VILLA",
    "مكتب": "OFFICE",
    "محل": "SHOP",
    "محل_تجاري": "SHOP",
    "مكتب تجاري": "COMMERCIALOFFICE",
    "مول": "MALL",
    "فندق": "HOTEL",
    "مصنع": "FACTORY",
    "مستودع": "WAREHOUSE",
    "أرض_فارغة": "EMPTYLAND",
    "أرض_زراعية": "AGRICULTURAL",
    "مبنى": "BUILDING",
    "شاليه": "CHALET",
    "استوديو": "STUDIO",
    "بيت_عربي": "ARABICHOUSE",
    "مزرعة": "FARM",
    "منتجع": "RESORT",
    "عيادة": "CLINIC",
    "معرض": "EXHIBITION",
    "موقف_سيارات": "PARKING",
    "مجاني": "FREE",
    "مميز": "PREMIUM",
    "حصري": "EXCLUSIVE",
    "أدمن": "ADMIN",
    "مستخدم_عادي": "USER",
    "مقبول": "ACCEPTED",
    "مرفوض": "REJECTED",
    "قيد_المراجعة": "PENDING",
    "بحاجة_إكساء": "NEEDSRENOVATION",
    "عادي": "NORMAL",
    "سوبر": "SUPER",
    "سوبر_ديلوكس": "SUPERDELUXE",
    "شكوى": "COMPLAINT",
    "استفسار": "INQUIRY"
};

const BasicInfo = (props) => {

    const initialState = {
        title: '',
        description: '',
        propertyType: '',
        purpose: '',
        status: '',
        regionId: null,
        street: '',
        price: null,
        rooms: null,
        area: null,
        floor: '',
        direction: '',
        contactInfo: '',
        errors: {
            title: null,
            description: null,
            street: null,
            price: null,
            rooms: null,
            area: null,
            floor: null,
            contactInfo: null,
        }
    };


    const [Property_Types, setProperty_Types] = useState([]);
    const [Property_Purposes, setProperty_Purposes] = useState([]);
    const [Property_Status, setProperty_Status] = useState([]);
    const [Governorates, setGovernorates] = useState([]);
    const [allCities, setallCities] = useState([]);
    const [Cities, setCities] = useState([]);
    const [Regions, setRegions] = useState([]);
    const [All_Directions, set_All_Directions] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [choosenGovernorate, setChoosenGovernorate] = useState(null);
    const [choosenCity, setChoosenCity] = useState(null);
    const [choosenRegion, setChoosenRegion] = useState(null);
    const [serverError, setServerError] = useState(null);

    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_FIELD':
                return { ...state, [action.field]: action.value };
            case 'UPDATE_INTEGER_FIELD':
                return { ...state, [action.field]: parseInt(action.value) };
            case 'REMOVE_FIELD':
                return { ...state, [action.field]: '' };
            case 'REMOVE_INTEGER_FIELD':
                return { ...state, [action.field]: null };
            case 'SET_ERROR':
                return { ...state, errors: { ...state.errors, [action.field]: action.value } };
            case 'RESET_ERROR':
                return { ...state, errors: { ...state.errors, [action.field]: null } };
            case 'RESET':
                return initialState;
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const propertyId = localStorage.getItem("propertyId");
        const getdata = async () => {
            const res = await getFullDetails(propertyId);
            const data = JSON.parse(res);
            console.log(data);
            const { title, description, propertyType, purpose, status, regionId, street, price, rooms, area, floor, direction, contactInfo } = data;
            const region = await getRegion(regionId);
            const city = await getCity(regionId);
            const governorate = await getGovernorate(city.city.id);
            console.log(region);
            console.log(city);
            console.log(governorate);
            setChoosenRegion({ value: region.id, label: region.name });
            setChoosenCity({ value: city.city.id, label: city.city.name });
            setChoosenGovernorate({ value: governorate.governorate.id, label: governorate.governorate.name });
            const reversed = reverseToArabic([propertyType, purpose, status, direction]);
            const fulldata = {
                title: title,
                description: description,
                propertyType: reversed[0],
                purpose: reversed[1],
                status: reversed[2],
                regionId: regionId,
                street: street,
                price: price,
                rooms: rooms,
                area: area,
                floor: floor,
                direction: reversed[3],
                contactInfo: contactInfo,
            };
            Object.keys(fulldata).forEach((field) => {
                dispatch({ type: 'UPDATE_FIELD', field, value: fulldata[field] });
            });
        };
        const currentStep = localStorage.getItem("currentStep");
        console.log(currentStep);
        console.log(propertyId);
        if (propertyId && currentStep == 1) {
            getdata();
        }
    }, []);
    useEffect(() => {
        const fetchStartingData = async () => {
            try {
                setLoading(true);
                const res = await getStartingData();
                console.log(res);
                const formattedTypes = res.types.map(item => ({ value: item, label: item }));
                const formattedStatuses = res.statuses.map(item => ({ value: item, label: item }));
                const formattedPurposes = res.purposes.map(item => ({ value: item, label: item }));
                const formattedGovernorates = res.governorates.map(item => ({ value: item.id, label: item.name }));
                const formattedDirections = res.directions.map(item => ({ value: item, label: item }));
                setProperty_Types(formattedTypes);
                setProperty_Purposes(formattedPurposes);
                setProperty_Status(formattedStatuses);
                setGovernorates(formattedGovernorates);
                set_All_Directions(formattedDirections);
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
        if (choosenGovernorate) {
            const fetchcities = async () => {
                try {
                    setLoading(true);
                    const res = await getCities(choosenGovernorate.value);
                    const formatted = res.map(item => ({ value: item.id, label: item.name }));
                    setallCities(formatted);
                    const maincity = formatted.find(item => item.label === choosenGovernorate.label);
                    const restofcities = formatted.slice(0, 20).filter((item) => !maincity || item.label !== maincity.label);
                    setCities([maincity, ...restofcities].filter(Boolean));
                }
                catch (error) {
                    console.log('خطأ في جلب مدن هذه المحافظة');
                } finally {
                    setLoading(false);
                }
            };
            fetchcities();
        }
        else {
            setChoosenCity(null);
            setChoosenRegion(null);
            setCities([]);
            setallCities([]);
            dispatch({ type: 'REMOVE_FIELD', field: 'regionId' });
            setRegions([]);
        }
    }, [choosenGovernorate]);

    useEffect(() => {
        if (choosenCity) {
            const fetchregions = async () => {
                try {
                    setLoading(true);
                    const res = await getRegions(choosenCity.value);
                    const formatted = res.map(item => ({ value: item.id, label: item.name }));
                    setRegions(formatted);
                }
                catch (error) {
                    console.log('خطأ في جلب مناطق هذه المدينة');
                }
                finally {
                    setLoading(false);
                }
            };
            fetchregions();
        }
        else {
            dispatch({ type: 'REMOVE_FIELD', field: 'regionId' });
            setRegions([]);
            setChoosenRegion(null);
        }
    }, [choosenCity])



    const labels = [
        { id: '1', label: 'اسم العقار' },
        { id: '2', label: 'وصف العقار' },
        { id: '3', label: 'نوع العقار' },
        { id: '4', label: 'حالة العقار' },
        { id: '5', label: 'الموقع' },
        { id: '6', label: 'السعر بالدولار' },
        { id: '7', label: 'عدد الغرف' },
        { id: '8', label: 'المساحة' },
        { id: '9', label: 'الطابق' },
        { id: '10', label: 'الاتجاهات' },
        { id: '11', label: 'وضع العقار' }
    ];

    const reverseToEnglish = (type, propertyPurpose, propertyStatus, propertyDirection) => {
        const propertyType = reversedTranslationMap[type];
        const purpose = reversedTranslationMap[propertyPurpose];
        const status = reversedTranslationMap[propertyStatus];
        const direction = propertyDirection.split('_').map(item => reversedTranslationMap[item]).join('_');
        return { propertyType, purpose, status, direction };
    };


    const submit = async (e) => {
        e.preventDefault();
        const { errors, ...rest } = state;

        const newstate = { ...rest, ...reverseToEnglish(rest.propertyType, rest.purpose, rest.status, rest.direction) };
        let data = null;
        setLoading(true);
        const propertyId = localStorage.getItem("propertyId");
        let property = null;
        if (propertyId) {
            property = await getFullDetails(propertyId);
            console.log(property, "PROPERTY FETCHED!!!!");
        }
        try {
            const res = property ? await updateBasicPropertyData(propertyId, newstate) : await submitBasicPropertyData(newstate);
            console.log(res);
            console.log(res);
            data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            console.log(data);

            if (res.ok) {
                setServerError(null);
                localStorage.setItem("propertyId", data.id);
                localStorage.setItem("currentStep", 2);
                props.next();
            }
            else {
                setServerError(res.error);
            }
        } catch (e) {
            console.log(e);
            setServerError(e.error);
        } finally {
            setLoading(false);
        }


    };

    const NextStep = () => {
        const { errors, street, price, rooms, area, floor, direction, ...rest } = state;
        const errorsnull = Object.values(state.errors).every(item => item === null);
        const restnotempty = Object.values(rest).every(item => item !== null && item !== undefined && item.toString().trim() !== '');
        return errorsnull && restnotempty;
    }

    return (<Fragment>
        <div className={classes.container}>
            <div className={`${classes.basicinfocontainer} ${Readex_Pro_Font.className}`}>

                <div className={classes.field}>
                    <label>{labels[0].label}*</label>
                    <input
                        name='name'
                        type='text'
                        placeholder='اسم العقار*'
                        className={`${classes.input} ${classes.common} `}
                        value={state.title}
                        onChange={(e) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'title', value: e.target.value });
                        }}
                        onBlur={() => {
                            const validate = validateTitle(state.title);
                            if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'title' }); return; }
                            else { dispatch({ type: 'SET_ERROR', field: 'title', value: validate }) }
                        }}
                        required />
                    {state.errors.title && <p className='text-red-500'>{state.errors.title}</p>}
                </div>
                <div className={classes.field}>
                    <label>{labels[1].label}*</label>
                    <textarea
                        name='description'
                        type='text'
                        placeholder='وصف العقار*'
                        value={state.description}
                        className={`${classes.textarea} ${classes.common} `}
                        onChange={(e) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'description', value: e.target.value })
                        }}
                        onBlur={() => {
                            const validate = validateDescription(state.description);
                            if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'description' }); return; }
                            else { dispatch({ type: 'SET_ERROR', field: 'description', value: validate }) }
                        }} />
                    {state.errors.description && <p className='text-red-500'>{state.errors.description}</p>}
                </div>
                <div className={classes.field}>
                    <label>{labels[2].label}*</label>
                    <Select
                        styles={customStyles}
                        options={Property_Types}
                        className={`${classes.wideselect} ${classes.common}  `}
                        value={Property_Types.find(option => option.label === state.propertyType) || null}
                        onChange={(selectedOption) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'propertyType', value: selectedOption ? selectedOption.label : '' });
                        }}
                        placeholder='نوع العقار*'
                        isClearable={true}
                        required />
                </div>

                <div className={classes.field}>
                    <label>{labels[3].label}*</label>
                    <Select
                        styles={customStyles}
                        options={Property_Purposes}
                        className={`${classes.wideselect} ${classes.common} `}
                        value={Property_Purposes.find(option => option.label === state.purpose) || null}
                        onChange={(selectedOption) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'purpose', value: selectedOption ? selectedOption.label : '' });
                        }}
                        placeholder='حالة العقار*'
                        isClearable={true}
                        required
                    />

                </div>
                <div className={classes.field}>
                    <label>{labels[10].label}*</label>
                    <Select
                        styles={customStyles}
                        options={Property_Status}
                        className={`${classes.wideselect} ${classes.common}`}
                        value={Property_Status.find(option => option.label === state.status) || null}
                        onChange={(selectedOption) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'status', value: selectedOption ? selectedOption.label : '' });
                        }}
                        placeholder='وضع العقار*'
                        isClearable={true}
                        required
                    />
                </div>
                <div className={classes.field}>
                    <label >{labels[4].label}*</label>
                    <div className={classes.pair}>

                        <Select
                            styles={customStyles}
                            options={Governorates}
                            className={`${classes.narrowselect} ${classes.common}`}
                            value={choosenGovernorate || null}
                            onChange={(selectedOption) => {
                                setChoosenGovernorate(selectedOption)
                            }}
                            placeholder='المحافظة*'
                            isClearable={true}
                            required
                        />


                        <Select
                            styles={customStyles}
                            options={Cities}
                            className={`${classes.narrowselect} ${classes.common} $`}
                            disabled={!choosenGovernorate}
                            value={choosenCity || null}
                            onChange={(selectedOption) => {
                                setChoosenCity(selectedOption)
                            }}
                            placeholder='المدينة*'
                            isClearable={true}
                            required
                            onInputChange={(inputValue) => {
                                if (inputValue) {
                                    const filtered = allCities
                                        .filter((city) =>
                                            city.label.startsWith(inputValue)
                                        ).slice(0, 20);
                                    setCities(filtered);
                                }
                                else {
                                    const maincity = allCities.find(item => item.label === choosenGovernorate.label);
                                    const restofcities = allCities.slice(0, 20).filter((item) => item !== maincity);
                                    setCities([maincity, ...restofcities].filter(Boolean));
                                }
                            }
                            }
                        />
                    </div></div>
                <div>
                    <Select
                        styles={customStyles}
                        options={Regions}
                        className={`${classes.narrowselect} ${classes.common} `}
                        disabled={!choosenCity}
                        value={choosenRegion || null}
                        onChange={(selectedOption) => {
                            setChoosenRegion(selectedOption);
                            dispatch({ type: 'UPDATE_INTEGER_FIELD', field: 'regionId', value: selectedOption.value })
                        }}
                        placeholder='المنطقة*'
                        isClearable={true}
                        required
                    />
                </div>
                <div>
                    <input
                        name='street'
                        type='text'
                        placeholder='شارع*'
                        className={`${classes.input} ${classes.common}`}
                        value={state.street || ''}
                        onChange={(e) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'street', value: e.target.value });
                        }}
                        onBlur={() => {
                            const validate = validateStreet(state.street);
                            if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'street' }); return; }
                            else { dispatch({ type: 'SET_ERROR', field: 'street', value: validate }) }
                        }}
                    />
                    {state.errors.street && <p className='text-red-500'>{state.errors.street}</p>}
                </div>

                <div className={classes.pair}>
                    <div className={classes.field}>
                        <label >{labels[5].label}*</label>
                        <div className={classes.inputwrapper}>
                            <input
                                name='price'
                                type='number'
                                placeholder='السعر بالدولار*'
                                className={`${classes.smallinput} ${classes.common}`}
                                value={state.price || ''}
                                onChange={(e) => {
                                    dispatch({ type: 'UPDATE_INTEGER_FIELD', field: 'price', value: e.target.value });
                                }}
                                onBlur={() => {
                                    const validate = validatePrice(state.price);
                                    if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'price' }); return; }
                                    else { dispatch({ type: 'SET_ERROR', field: 'price', value: validate }) }
                                }}
                            />
                            {state.price && <span className={classes.unit}>$</span>}
                        </div>
                    </div>
                    <div className={classes.field}>
                        <label >{labels[6].label}*</label>
                        <input
                            name='roomsnum'
                            type='number'
                            placeholder='عدد الغرف*'
                            className={`${classes.smallinput} ${classes.common}`}
                            value={state.rooms || ''}
                            onChange={(e) => {
                                dispatch({ type: 'UPDATE_INTEGER_FIELD', field: 'rooms', value: e.target.value });
                            }}
                            onBlur={() => {
                                const validate = validateRooms(state.rooms);
                                if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'rooms' }); return; }
                                else { dispatch({ type: 'SET_ERROR', field: 'rooms', value: validate }) }
                            }}
                        />
                    </div>
                </div>
                {state.errors.price && <p className='text-red-500'>{state.errors.price}</p>}
                {state.errors.rooms && <p className='text-red-500'>{state.errors.rooms}</p>}
                <div className={classes.pair}>
                    <div className={classes.field}>
                        <label >{labels[7].label}*</label>
                        <div className={classes.inputwrapper}>
                            <input
                                name='area'
                                type='number'
                                placeholder='المساحة*'
                                className={`${classes.smallinput} ${classes.common}`}
                                value={state.area || ''}
                                onChange={(e) => {
                                    dispatch({ type: 'UPDATE_INTEGER_FIELD', field: 'area', value: e.target.value });
                                }}
                                onBlur={() => {
                                    const validate = validateArea(state.area);
                                    if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'area' }); return; }
                                    else { dispatch({ type: 'SET_ERROR', field: 'area', value: validate }) }
                                }}
                            />
                            {state.area && <span className={classes.unit}>م²</span>}</div>
                    </div>
                    <div className={classes.field}>
                        <label >{labels[8].label}*</label>
                        <input
                            name='floor'
                            type='text'
                            placeholder='الطابق*'
                            className={`${classes.smallinput} ${classes.common}`}
                            value={state.floor || ''}
                            onChange={(e) => {
                                dispatch({ type: 'UPDATE_FIELD', field: 'floor', value: e.target.value });
                            }}
                            onBlur={() => {
                                const validate = validateFloor(state.floor);
                                if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'floor' }); return; }
                                else { dispatch({ type: 'SET_ERROR', field: 'floor', value: validate }) }
                            }}
                        />
                    </div>
                </div>
                {state.errors.area && <p className='text-red-500'>{state.errors.area}</p>}
                {state.errors.floor && <p className='text-red-500'>{state.errors.floor}</p>}
                <div className={classes.field}>
                    <label >{labels[9].label}*</label>
                    <Select
                        styles={customStyles}
                        options={All_Directions}
                        className={`${classes.wideselect} ${classes.common}`}
                        id='directions'
                        name='directions'
                        value={All_Directions.find(option => option.label === state.direction) || null}
                        onChange={(selectedOption) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'direction', value: selectedOption ? selectedOption.label : '' });
                        }}
                        placeholder='الاتجاهات*'
                        isClearable
                    />
                </div>
                <div>
                    <label className={classes.contactlabel}>معلومات الاتصال*</label>
                    <textarea
                        name='contactinfo'
                        type='text'
                        placeholder='أدخل البريد الالكتروني أو رقم الهاتف أو أي وسيلة موثوقة للوصول إليك'
                        className={`${classes.contacttextarea} ${classes.common}`}
                        value={state.contactInfo || ''}
                        onChange={(e) => {
                            dispatch({ type: 'UPDATE_FIELD', field: 'contactInfo', value: e.target.value });
                        }}
                        onBlur={() => {
                            const validate = validateContact(state.contactInfo);
                            if (validate === true) { dispatch({ type: 'RESET_ERROR', field: 'contactInfo' }); return; }
                            else { dispatch({ type: 'SET_ERROR', field: 'contactInfo', value: validate }) }
                        }}
                        required />
                    {state.errors.contactInfo && <p className='text-red-500'>{state.errors.contactInfo}</p>}
                </div>
            </div>
            <div className={classes.pic}></div>

            {Loading && <div className={classes.overlay}>
                <div className={classes.spinner}>
                </div>
                <p>جار التحميل...</p>
            </div>}
        </div>
        <button
            type="button"
            disabled={!NextStep()}
            onClick={submit}
            className={`text-white py-3 mb-2 px-8 rounded-[8px] mx-32 text-[18px] font-bold transition-all duration-300
    ${!NextStep()
                    ? 'bg-gray-700 hover:bg-gray-700 cursor-not-allowed'
                    : 'bg-sky-900 hover:bg-sky-700 cursor-pointer'}
                        `}
        >
            التالي
        </button>
        {serverError && <p className='text-red-500 text-[18px] font-bold w-full p-8 mx-auto mb-32'>{serverError}</p>}
    </Fragment>);
}
export default BasicInfo;