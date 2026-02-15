import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignUpClient from "@/components/dashboard-components/register-user-client";



const AddUser = async () => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role !== "SUPERADMIN") redirect("/dashboard");

    return <SignUpClient />

};
export default AddUser;