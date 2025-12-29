import UserProfile from "./viewuserdetails";
const ViewDetail = async ({ params }) => {
    const { id } = await params;
    console.log('owner id : ', id);
    return (<UserProfile id={id} />)
}
export default ViewDetail;