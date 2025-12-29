import SideBar from "@/components/dashboard-components/sidebar";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";



const Layout = ({ children }) => {

    return <>
        <Navbar />
        {children}
        <Footer />
    </>
};
export default Layout;