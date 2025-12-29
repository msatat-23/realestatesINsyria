import classes from './loading.module.css';


const Loading = ({ text }) => {
    const feedBack = text || "جار التحميل...";

    return (<div className={classes.overlay}>
        <div className={classes.spinner}></div>
        <p>{feedBack}</p>
    </div>)
}
export default Loading;