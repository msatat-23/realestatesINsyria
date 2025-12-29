import AddPropertyClient from "./add-property-client";


const AddProperty = async ({ params }) => {
    const { id } = await params;



    return (<AddPropertyClient id={id} />)
}
export default AddProperty;