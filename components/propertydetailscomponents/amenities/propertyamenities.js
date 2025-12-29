import classes from './amenities.module.css';



const PropertyAmenities = async ({ info }) => {


    return (
        <div className={classes.container}>
            {info.length > 0 && <h1 className={classes.header}>مميزات العقار</h1>}
            <table className={classes.table}>
                <tbody>
                    {info.map((item) => <tr><td>{item.amenity.name}</td><td>{item.description}</td></tr>)}
                </tbody>
            </table></div>
    )
}

export default PropertyAmenities;