import classes from "./page.module.css"
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { auth } from "@/auth";
import SideBar from "@/components/dashboard-components/sidebar";
import { redirect } from "next/navigation";


const Layout = async ({ children }) => {

    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") {
        redirect("/");
    };

    return <div className={classes.layout}>
        <Navbar />
        <div className={classes.dashboard}>
            <SideBar role={role} />
            {children}
        </div>
        <Footer />
    </div>
};
export default Layout;