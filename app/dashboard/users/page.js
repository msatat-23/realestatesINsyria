import prisma from "@/lib/prisma";
import UsersClient from "@/components/dashboard-components/users";


const Users = async () => {



    const total = await prisma.user.count();

    return <UsersClient total={total} />
};
export default Users;