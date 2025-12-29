import ProfileClient from './profileclient';

const Profile = async ({ searchParams }) => {
    const searchparams = await searchParams;
    const key = searchparams?.section;

    return <ProfileClient section={key || ''} />;
};

export default Profile;
