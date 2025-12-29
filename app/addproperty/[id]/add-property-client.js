'use client'
import React, { Fragment, useEffect, useState } from 'react';
import classes from './page.module.css';
import Navbar from '@/components/navbar/navbar';
import BasicInfo from '@/components/addpropertycomponents/basicinfostep';
import Amenities from '@/components/addpropertycomponents/amenities';
import { Readex_Pro } from 'next/font/google';
import Footer from '@/components/footer/footer';
import ProgressBar from '@/components/addpropertycomponents/steps';
import Images from '@/components/addpropertycomponents/images';
import Video from '@/components/addpropertycomponents/video';
const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });




const AddPropertyClient = (props) => {
    const [currentStep, setCurrentStep] = useState(1);
    const id = props.id;
    const isnew = id === 'new';

    useEffect(() => {
        if (!isnew) {
            localStorage.setItem("propertyId", id);
        }
    }, []);

    useEffect(() => {
        const step = localStorage.getItem("currentStep");
        if (step && step !== currentStep) {
            setCurrentStep(parseInt(step));
            console.log(step);
        }
        else if (!step) {
            localStorage.setItem("currentStep", 1);
        }
    }, []);

    useEffect(() => {
        console.log(currentStep);
    }, [currentStep]);

    const nextStep = () => {
        setCurrentStep(prev => ++prev);
        const localStep = localStorage.getItem("currentStep");
        if (localStep) localStorage.setItem("currentStep", parseInt(localStep) + 1);
    };
    const previousStep = () => {
        setCurrentStep(prev => --prev);
        const localStep = localStorage.getItem("currentStep");
        if (localStep) localStorage.setItem("currentStep", parseInt(localStep) - 1);
    }

    return (
        <Fragment>
            <div className={`${classes.page} ${Readex_Pro_Font.className}`}>
                <Navbar mainpage={false} />
                <ProgressBar step={currentStep} />
                {currentStep === 1 && <BasicInfo next={nextStep} previous={previousStep} />}
                {currentStep === 2 && <Images next={nextStep} previous={previousStep} />}
                {currentStep === 3 && <Video next={nextStep} previous={previousStep} />}
                {currentStep === 4 && <Amenities next={nextStep} previous={previousStep} />}
                <Footer />
            </div>
        </Fragment >
    );
};

export default AddPropertyClient;
