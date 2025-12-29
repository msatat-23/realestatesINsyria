'use client';

import styles from './page.module.css';
import { Fragment } from 'react';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import { Readex_Pro } from 'next/font/google';

const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });
export default function Terms() {
    return (<Fragment>
        <Navbar />
        <div className={`${styles.container} ${Readex_Pro_Font.className}`}>
            <h1 className={styles.title}>شروط الاستخدام</h1>

            <p className={styles.paragraph}>
                باستخدام هذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءة الشروط بعناية.
            </p>

            <h2 className={styles.subtitle}>1. القبول بالشروط</h2>
            <p className={styles.paragraph}>
                عند استخدامك للموقع، فإنك توافق على الالتزام بهذه الشروط وجميع القوانين المعمول بها.
            </p>

            <h2 className={styles.subtitle}>2. استخدام الموقع</h2>
            <p className={styles.paragraph}>
                يجب استخدام الموقع لأغراض قانونية فقط، ولا يجوز استخدامه لخرق حقوق الآخرين أو نشر محتوى ضار.
            </p>

            <h2 className={styles.subtitle}>3. المحتوى</h2>
            <p className={styles.paragraph}>
                جميع المحتويات على الموقع محمية بحقوق الملكية، ولا يجوز نسخها أو إعادة نشرها دون إذن.
            </p>

            <h2 className={styles.subtitle}>4. التعديلات</h2>
            <p className={styles.paragraph}>
                نحتفظ بحق تعديل الشروط في أي وقت، ويستمر استخدامك للموقع بعد التعديل يعني قبولك لهذه التغييرات.
            </p>

            <h2 className={styles.subtitle}>5. المسؤولية</h2>
            <p className={styles.paragraph}>
                نحن لا نتحمل أي مسؤولية عن أي أضرار ناتجة عن استخدام الموقع.
            </p>
        </div>
        <Footer />
    </Fragment>
    );
}
