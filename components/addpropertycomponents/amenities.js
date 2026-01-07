'use client'
import { useEffect, useState, Fragment } from 'react';
import classes from './amenities.module.css';
import Select from 'react-select';
import { getAllPropertyAmenities, getAmenities } from '@/app/addproperty/[id]/get-data';
import { addAmenities, setCompleted } from '@/app/addproperty/[id]/send-data';
import { redirect, useRouter } from 'next/navigation';
import Loading from '../loading/loading';
const customStyles = {
    control: (base) => ({
        ...base,
        minHeight: '56px',
        height: '56px',
        background: 'linear-gradient(to bottom right, #ffffff, #f6f3ed)',
        borderRadius: '5px',

        border: '1px #666666 solid',
        color: '#252525'

    }),
};



const Amenities = (props) => {
    const [Amenities, setAmenities] = useState([]);
    const [chosenAmenities, setChosenAmenities] = useState([]);
    const [chosenAmenity, setchoosenAmenity] = useState('');
    const [AmenityDescription, setAmenityDesctiption] = useState('');
    const [propertyId, setPropertyId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    useEffect(() => {
        const fetchamenities = async () => {
            try {
                setLoading(true);
                const res = await getAmenities();
                const data = res;
                console.log(res);
                const formatted = data.map(item => ({ value: item.id, label: item.name }));
                setAmenities(formatted);
            } catch {
                console.log('خطأ في احضار المرفقات');
            }
        };
        const fetchPropertyAmenity = async (id) => {
            try {
                const res = await getAllPropertyAmenities(id);
                const amenities = res.map(item => { return { propertyId: item.propertyId, amenity: item.amenity.name, amenityId: item.amenityId, description: item.description } });
                if (amenities.length > 0) setChosenAmenities(amenities);
            }
            catch (e) {
                console.log("خطأ في إحضار مرفقات العقار!!", e);
            }
            finally {
                setLoading(false);
            }
        };
        const propertyid = localStorage.getItem("propertyId");
        if (propertyid) {
            setPropertyId(propertyid);
            fetchamenities();
            fetchPropertyAmenity(propertyid);
        }
        else {
            localStorage.setItem("currentStep", 1);
        }
    }, []);

    const addAmenityHandler = () => {
        setError('');
        const exists = chosenAmenities.find(
            (ele) => ele.amenityId === chosenAmenity.value
        );

        if (exists) {
            setError('لقد أضفت هذا المرفق!');
            return;
        }
        setChosenAmenities(prev => [...prev, { propertyId: parseInt(propertyId), amenity: chosenAmenity.label, amenityId: chosenAmenity.value, description: AmenityDescription }]);
        setchoosenAmenity('');
        setAmenityDesctiption('');
    };

    const submitHandler = async () => {
        let added = true;
        const amenitiesToSend = chosenAmenities.map((item) => { return { propertyId: item.propertyId, amenityId: item.amenityId, description: item.description } });
        if (amenitiesToSend.length > 0) {
            try {
                setLoading(true);
                const res = await addAmenities(amenitiesToSend);
                console.log(res);

            } catch (e) {
                console.log("فشل في إضافة المرفقات!!", e);
                added = false;
                setLoading(false);
                setError('فشل في إضافة المرفقات يرجى المحاولة لاحقا...');
            }
        }
        if (added) {
            try {
                setLoading(true);
                const res = await setCompleted(propertyId);
                // const data = JSON.parse(res.data);
                // console.log(data);
                localStorage.removeItem("propertyId");
                localStorage.removeItem("currentStep");
                if (res.ok) window.location.replace('/');;

            } catch (e) {
                console.log("فشل في ضبط العقار مكتملا!!!", e);
            }
            finally {
                setLoading(false);
            }
        }
    };
    return (<Fragment>
        <div className={classes.amenitiessection}>
            <div className={classes.container}>
                <label htmlFor='chooseamenity' className={classes.label}>أضف مرفقات العقار</label>
                <div className={classes.inputs}>
                    <Select
                        styles={customStyles}
                        options={Amenities}
                        className={classes.choose}
                        onChange={(selectedOption) => setchoosenAmenity(selectedOption)}
                        value={chosenAmenity}
                        placeholder='اختر المرفق'
                        isClearable={true} />
                    <input
                        className={classes.input}
                        type='text'
                        placeholder='وصف المرفق'
                        value={AmenityDescription}
                        onChange={(event) => setAmenityDesctiption(event.target.value)} />
                </div>
                <button className={classes.addBtn} onClick={addAmenityHandler}>إضافة مرفق جديد</button>
            </div>
            <div className={classes.pic} />
        </div>

        {error && <p className='text-red-500 text-center'>{error}</p>}
        <div className={classes.addedAmenities}>
            {chosenAmenities.length > 0 && chosenAmenities.map(
                (amenity) => {
                    return <div key={amenity.amenityId} className={classes.amenity}>
                        <h1 className={classes.shownlabel}>{amenity.amenity}</h1>
                        <p className={classes.showndescription}>{amenity.description}</p>

                        <button className={`${classes.button}`}
                            onClick={() => {
                                setChosenAmenities(prev => prev.filter(item => item.amenityId !== amenity.amenityId));
                            }}>حذف المرفق</button>
                    </div>
                }
            )}
        </div>
        <div className="w-full flex justify-around items-center mb-32 m-auto">
            <button type='button' onClick={() => { props.previous(); }} disabled={loading} className={`text-white w-[250px] h-[51px] text-center rounded-lg transition-all duration-300 text-[18px] font-bold
        ${(!loading) ? 'bg-sky-900 hover:bg-sky-700 cursor-pointer' : 'bg-gray-700 cursor-not-allowed'}`}>
                العودة إلى الخطوة السابقة</button>
        </div>
        <p className='w-full mb-16 pr-[50px] font-bold text-[18px] text-sky-800'>
            يمكنك الإعلان عن العقار بدون إضافة أي مرفق .
        </p>
        < button className={classes.submit} type='button' onClick={submitHandler}>
            أعلن عن العقار
        </button>
        {loading && <Loading />}
    </Fragment>);
}
export default Amenities;