'use client';
import { Fragment } from 'react';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import styles from './page.module.css';
import { Readex_Pro } from 'next/font/google';

const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });
export default function PrivacyPolicy() {
    return (<Fragment>
        <Navbar />
        <div className={`${styles.container}  ${Readex_Pro_Font.className}`}>
            <h1 className={styles.title}>سياسة الخصوصية</h1>

            <p className={styles.paragraph}>
                نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية عند استخدام موقعنا. هذه السياسة توضح نوع البيانات التي نجمعها وكيف نستخدمها.
            </p>

            <h2 className={styles.subtitle}>1. جمع البيانات</h2>
            <p className={styles.paragraph}>
                نقوم بجمع البيانات التالية عند استخدامك لموقعنا:
            </p>
            <ul className={styles.list}>
                <li>معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف.</li>
                <li>معلومات العقارات التي تبحث عنها أو تضيفها.</li>
                <li>سلوك التصفح داخل الموقع لتحسين تجربتك.</li>
            </ul>

            <h2 className={styles.subtitle}>2. استخدام البيانات</h2>
            <p className={styles.paragraph}>
                نستخدم بياناتك للأغراض التالية:
            </p>
            <ul className={styles.list}>
                <li>توفير خدمات الموقع بشكل صحيح.</li>
                <li>تحسين تجربة المستخدم وتخصيص المحتوى.</li>
                <li>التواصل معك بشأن تحديثات الموقع أو عروض خاصة.</li>
            </ul>

            <h2 className={styles.subtitle}>3. مشاركة البيانات</h2>
            <p className={styles.paragraph}>
                لا نشارك بياناتك الشخصية مع أي طرف ثالث إلا إذا كان مطلوباً بموجب القانون أو لحماية حقوقنا.
            </p>

            <h2 className={styles.subtitle}>4. حقوقك</h2>
            <p className={styles.paragraph}>
                يمكنك طلب الوصول إلى بياناتك، تصحيحها، أو حذفها في أي وقت عن طريق التواصل معنا.
            </p>

            <h2 className={styles.subtitle}>5. التعديلات على السياسة</h2>
            <p className={styles.paragraph}>
                نحتفظ بالحق في تعديل هذه السياسة في أي وقت، وسيتم إعلام المستخدمين بالتغييرات المهمة.
            </p>
        </div>
        <Footer /></Fragment>
    );
}
