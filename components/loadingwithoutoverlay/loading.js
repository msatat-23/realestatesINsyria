import classes from './loading.module.css';
const Loading = () => {

    return (<div className={classes.overlay}>
        <div className={classes.spinner}></div>
        <p>جار التحميل...</p>
    </div>)
}
export default Loading;