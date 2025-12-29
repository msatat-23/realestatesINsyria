import classes from './page.module.css';
import LogInClient from './loginClient';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
const Login = () => {


    return <div className={classes.page}>
        <Navbar />
        <LogInClient />
        <Footer />
    </div>
}
export default Login;