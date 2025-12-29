import classes from './contactinfo.module.css';


const ContactInfo = async ({ contact }) => {

    return (<div className={classes.container}><h1>معلومات التواصل :</h1>
        <p>{contact}</p></div>)
}

export default ContactInfo;