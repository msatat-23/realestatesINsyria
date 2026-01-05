"use client"
import Link from "next/link";
import classes from "./sidebar.module.css";
import { usePathname } from "next/navigation";
const SideBar = ({ role }) => {
    const pathName = usePathname();



    const sections = [
        { key: "main", label: "الرئيسية", to: "/dashboard" },
        { key: 'users', label: 'المستخدمين', to: "/dashboard/users" },
        { key: 'properties', label: 'العقارات', to: "/dashboard/properties" },
        { key: 'locations', label: 'إدارة المواقع', to: "/dashboard/location-management" },
        { key: 'subscriptions', label: 'طلبات الاشتراك', to: "/dashboard/subscriptions" },
        { key: 'complaints', label: 'الشكاوي', to: "/dashboard/complaints" },
    ];

    if (role == "SUPERADMIN") sections.push({ key: "adduser", label: "إضافة مستخدم", to: "/dashboard/add-user" });

    return <div className={classes.sidebar}>
        <div>
            {sections.map((section) => {
                const isActive = pathName === section.to;
                return (<Link
                    href={section.to}
                    key={section.key}
                    className={`${classes.section_link} ${isActive ? classes.active : ''}`}
                >
                    {section.label}
                </Link>)
            })}
        </div>

    </div>
};
export default SideBar;