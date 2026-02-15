import prisma from "@/lib/prisma";
import PropertiesClient from "@/components/dashboard-components/properties";




const Properties = async () => {



    const total = await prisma.property.count();

    return <PropertiesClient total={total} />

};
export default Properties;