import classes from "./page.module.css"
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";



const Layout = ({ children }) => {

    return <div className={classes.layout}>
        <Navbar />
        {children}
        <Footer />
    </div>
};
export default Layout;