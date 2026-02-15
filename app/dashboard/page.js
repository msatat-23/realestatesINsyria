import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import SideBar from "@/components/dashboard-components/sidebar";
import { redirect } from "next/navigation";



const Dashboard = async () => {


    const data = await prisma.$transaction([
        prisma.user.count({ where: { role: "USER" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.property.count(),
        prisma.property.count({ where: { state: "ACCEPTED", completed: true } }),
        prisma.property.count({ where: { state: "REJECTED", completed: true } }),
        prisma.property.count({ where: { state: "PENDING", completed: true } }),
        prisma.governorate.count(),
        prisma.city.count(),
        prisma.region.count(),
        prisma.user.count({ where: { subscription: "EXCLUSIVE" } }),
        prisma.user.count({ where: { subscription: "PREMIUM" } }),
        prisma.user.count({ where: { subscription: "FREE" } }),
        prisma.complaint.count(),
        prisma.complaint.count({ where: { readByAdmin: true } }),
        prisma.complaint.count({ where: { readByAdmin: false } }),
    ]);

    const formattedData = [
        { id: 1, title: "المستخدمين", count: data[0] },
        { id: 2, title: "المشرفين", count: data[1] },
        { id: 3, title: "العقارات كاملة", count: data[2] },
        { id: 4, title: "العقارات المقبولة", count: data[3] },
        { id: 5, title: "العقارات المرفوضة", count: data[4] },
        { id: 6, title: "العقارات قيد المراجعة", count: data[5] },
        { id: 7, title: "المحافظات", count: data[6] },
        { id: 8, title: "المدن", count: data[7] },
        { id: 9, title: "المناطق", count: data[8] },
        { id: 10, title: "الاشتراك الحصري", count: data[9] },
        { id: 11, title: "الاشتراك المميز", count: data[10] },
        { id: 12, title: "الاشتراك المجاني", count: data[11] },
        { id: 13, title: "الشكاوي", count: data[12] },
        { id: 14, title: "الشكاوي المقروءة", count: data[13] },
        { id: 15, title: "الشكاوي غير المقروءة", count: data[14] },
    ];
    return <div className={classes.statistics}>
        {formattedData.map(card => <div key={card.id} className={classes.card}>
            <h1 className={classes.title}>{card.title}</h1>
            <p className={classes.count}>{card.count}</p>
        </div>
        )}
    </div>

}
export default Dashboard;   