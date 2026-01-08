"use client"
import Link from "next/link";
import classes from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { useAdminContext } from "./listen";
const SideBar = ({ role }) => {
    const pathName = usePathname();
    const { userCount, propertyCount, subRequestCount, complaintCount } = useAdminContext();


    const sections = [
        { key: "main", label: "الرئيسية", to: "/dashboard" },
        { key: 'users', label: 'المستخدمين', to: "/dashboard/users", count: userCount },
        { key: 'properties', label: 'العقارات', to: "/dashboard/properties", count: propertyCount },
        { key: 'locations', label: 'إدارة المواقع', to: "/dashboard/location-management" },
        { key: 'subscriptions', label: 'طلبات الاشتراك', to: "/dashboard/subscriptions", count: subRequestCount },
        { key: 'complaints', label: 'الشكاوي', to: "/dashboard/complaints", count: complaintCount },
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
                    {typeof section.count === "number" && section.count > 0 && <span className={classes.span}>{section.count}</span>}
                </Link>)
            })}
        </div>

    </div>
};
export default SideBar;