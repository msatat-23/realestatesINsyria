import Navbar from '@/components/navbar/navbar';
import classes from './page.module.css';
import SignUpClient from './signupClient';
import Footer from '@/components/footer/footer';

const SignUp = () => {
    return (
        <div className={classes.page}>
            <Navbar />
            <SignUpClient />
            <Footer />
        </div>
    )
}
export default SignUp;