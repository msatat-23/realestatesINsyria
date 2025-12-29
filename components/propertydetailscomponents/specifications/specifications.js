import classes from './specifications.module.css';
const reverseToArabic = (arr) => {
    const translationMap = {
        "EAST": "شرقي",
        "WEST": "غربي",
        "SOUTH": "جنوبي",
        "NORTH": "شمالي",
    };
    return arr.map((item) => {
        const itemarr = item.split('_');
        return itemarr.map((word) => translationMap[word]).join('_');
    });
}

const Specifications = async ({ region, city, governorate, price, area, direction, rooms, floor }) => {

    return (<div className={classes.container}>
        <h1 className={classes.header}>المواصفات</h1>
        <table className={classes.table}>
            <tbody>
                {governorate && <tr><td>المحافظة</td><td>{governorate}</td></tr>}
                {city && <tr><td>المدينة</td><td>{city}</td></tr>}
                {region && <tr><td>المنطقة</td><td>{region}</td></tr>}
                {price && <tr><td>السعر</td><td>{price}$</td></tr>}
                {area && <tr><td>المساحة</td><td>{area}m</td></tr>}
                {direction && <tr><td>الاتجاهات</td><td>{reverseToArabic([direction])}</td></tr>}
                {rooms && <tr><td>عدد الغرف</td><td>{rooms}</td></tr>}
                {floor && <tr><td>الطابق</td><td>{floor}</td></tr>}
            </tbody>
        </table>
    </div>)
}
export default Specifications;