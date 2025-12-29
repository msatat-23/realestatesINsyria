
import classes from './sidebar.module.css';
import { useState } from 'react';
const SideBar = ({ onchange, activeSection }) => {
    const sections = [
        { key: 'info', label: 'معلومات الحساب' },
        { key: 'myproperties', label: 'عقاراتي' },
        { key: 'savedproperties', label: 'المفضلة' },
        { key: 'sub', label: 'اشترك الآن' },
        { key: 'settings', label: 'إعدادات الحساب' },
    ];

    return (
        <div className={`${classes.sidebar}`}>
            <ul>
                {sections.map((section) => (
                    <li
                        key={section.key}
                        className={activeSection === section.key ? classes.active : ''}
                        onClick={() => onchange(section.key)}
                    >
                        {section.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;
