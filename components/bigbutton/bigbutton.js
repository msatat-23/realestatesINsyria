"use client"
import classes from './bigbutton.module.css';


const ShowMorePropertiesBtn = ({ showMore }) => {



    return (<button className={classes.button} onClick={() => { showMore() }}>إظهار المزيد من العقارات المميزة</button>)
}

export default ShowMorePropertiesBtn;