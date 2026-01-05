import classes from "./page.module.css";

const LoadingPage = () => {

    return <div className={classes.overlay}>
        <div className={classes.spinner}></div>
        <p>جاري التحميل ...</p>
    </div>
};
export default LoadingPage;