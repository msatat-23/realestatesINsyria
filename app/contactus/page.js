'use client'
import classes from './page.module.css';
import ReactDOM from "react-dom";
import { Fragment, useState } from 'react';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import { Readex_Pro } from 'next/font/google';
import { sendComplaint } from './send-complaint';
import Loading from '@/components/loading/loading';
import Confirm from '@/components/confirmcomponent/confirm';

const Map = {
    "استفسار": "INQUIRY",
    "شكوى": "COMPLAINT"
};

const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });
const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const [showFeedBackModal, setShowFeedBackModal] = useState(false);
    const [feedBackModalText, setFeedBackModalText] = useState("");
    const [serverResponse, setServerResponse] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        complaintType: 'استفسار',
        description: '',
        propertyId: null
    });
    const [formDataErrors, setFormDataErrors] = useState({
        name: null,
        email: null,
        complaintType: null,
        description: null,
        propertyId: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            name: formData.name,
            email: formData.email,
            complaintType: Map[formData.complaintType],
            description: formData.description,
            propertyId: formData.propertyId
        };
        console.log(dataToSend)
        try {
            setLoading(true);
            const response = await sendComplaint(dataToSend);
            console.log(response);
            if (!response.ok) {
                setServerResponse({ text: response.error, type: "error" });
            }
            else {
                setShowFeedBackModal(true);
                setServerResponse({ text: "تم إرسال رسالتك بنجاح وسيتم الرد عليك عن طريق بريدك الالكتروني في أقرب وقت.", type: "success" });
                setFeedBackModalText("تم إرسال رسالتك بنجاح سيتم الرد عليك بالبريد الالكتروني خلال فترة قصيرة.");
                setFormData({ name: '', email: '', complaintType: 'استفسار', description: '', propertyId: null });
            }
        } catch (e) {
            console.log("failed to add complaint : ", e);
            setServerResponse({ text: e, type: "error" });
        } finally {
            setLoading(false);
        }
        console.log(formData);

    };

    const closeFeedBackModal = () => {
        setShowFeedBackModal(false);
    };

    const disabled = () => {
        if ((Object.values(formDataErrors).every(value => value == null || value == false)) &&
            (Object.entries(formData).every(([key, value]) => {
                if (key != "propertyId") { return value != "" && value != null }
                else { return true; }
            }))) {
            return false;
        }
        else return true;
    };

    return (<Fragment>
        <div className={Readex_Pro_Font.className}>
            <Navbar mainpage={false} />
            <div className={`${classes.container} ${Readex_Pro_Font.className}`}>
                <h1 className={classes.title}>اتصل بنا</h1>
                <p className={classes.description}>نحن في موقعنا العقاري نحرص على تقديم أفضل تجربة للمستخدم، سواء كنت تبحث عن عقار أحلامك أو تقوم بعرض عقارك للبيع أو الإيجار.

                    إن كانت لديك أي استفسارات، اقتراحات، أو واجهت أي مشكلة أثناء استخدام الموقع، فريق الدعم جاهز لسماعك ومساعدتك في أسرع وقت ممكن.

                    يرجى استخدام النموذج أدناه للتواصل معنا، أو اختيار قسم الشكاوى إذا كنت ترغب بالإبلاغ عن محتوى أو مشكلة محددة.</p>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <div className="w-full">
                        <input
                            type="text"
                            name="name"
                            placeholder="الاسم الكامل"
                            value={formData.name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, [e.target.name]: value });
                                if (!value || value.trim() === "") {
                                    setFormDataErrors({ ...formDataErrors, name: true });
                                }
                                else {
                                    setFormDataErrors({ ...formDataErrors, name: false });
                                }
                            }}
                            required
                            className={classes.input}
                        />
                        {formDataErrors.name && <p className='text-red-500'>الاسم مطلوب!!</p>}
                    </div>
                    <div className="w-full">
                        <input
                            type="email"
                            name="email"
                            placeholder="البريد الإلكتروني"
                            value={formData.email}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, [e.target.name]: value });
                                if (!value || value.trim() === "") {
                                    setFormDataErrors({ ...formDataErrors, email: true });
                                }
                                else {
                                    setFormDataErrors({ ...formDataErrors, email: false });
                                }
                            }
                            }
                            required
                            className={classes.input}
                        />
                        {formDataErrors.email && <p className='text-red-500'>البريد الالكتروني مطلوب!!</p>}
                    </div>
                    <select name="complaintType" value={formData.complaintType} onChange={(e) => {
                        setFormData({ ...formData, complaintType: e.target.value })
                    }} className={classes.select}>
                        <option value="استفسار">استفسار</option>
                        <option value="شكوى">شكوى</option>
                    </select>
                    <div className="w-full">
                        <textarea
                            name="description"
                            placeholder="محتوى الرسالة"
                            rows={6}
                            value={formData.description}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, [e.target.name]: value });
                                if (!value || value.trim() === "") {
                                    setFormDataErrors({ ...formDataErrors, description: true });
                                }
                                else {
                                    setFormDataErrors({ ...formDataErrors, description: false });
                                }
                            }}
                            required
                            className={classes.textarea}
                        ></textarea>
                        {formDataErrors.description && <p className='text-red-500'>محتوى الرسالة مطلوب!!</p>}
                    </div>

                    {formData.complaintType === 'شكوى' &&
                        <div className='w-full'>
                            <input type="text"
                                name="propertyId"
                                placeholder="أدخل كود العقار إذا كانت الشكوى موجهة ضد عقار معين"
                                value={formData.propertyId}
                                onChange={handleChange}
                                onBlur={() => {
                                    const id = Number(formData.propertyId);
                                    if (isNaN(id)) {
                                        setFormDataErrors({ ...formDataErrors, propertyId: true })
                                    }
                                    else {
                                        setFormDataErrors({ ...formDataErrors, propertyId: false })
                                    }
                                }}
                                className={classes.input} />
                            {formDataErrors.propertyId && <p className='text-red-500'>كود العقار يتكون من أرقام فقط!!</p>}
                        </div>
                    }

                    <button className={classes.button} type="submit" disabled={disabled()}>إرسال</button>
                    {serverResponse && <div className={`p-12 rounded-2xl flex justify-center align-middle ${serverResponse.type === "error" ? "bg-red-300 text-red-500" : "bg-green-300 text-green-500"}`}>
                        {serverResponse.text}
                    </div>}
                </form>
            </div>
            <Footer />
            {loading && <Loading />}
            {showFeedBackModal && ReactDOM.createPortal(<Confirm text={feedBackModalText} unMount={closeFeedBackModal} />, document.getElementById("feedback_modal_root"))}
        </div> </Fragment>
    );
}
export default ContactUs;