import PropertyClient from "./propertyClient";

const PropertyDetails = async ({ params }) => {
    const { id } = await params;
    console.log("Property ID:", id);

    const property = await prisma.$transaction([
        prisma.property.findUnique({
            where: { id: parseInt(id) },
            include: {
                region: { include: { city: { include: { governorate: true } } } },
            }
        }),
        prisma.image.findMany({ where: { propertyId: parseInt(id) } }),
        prisma.propertyAmenity.findMany({ where: { propertyId: parseInt(id) } })
    ]);
    console.log(property)
    if (!property[0]) {
        return (
            <div className={classes.notfound}>
                <h2>العقار غير موجود</h2>
                <p>ربما تم حذفه أو أن الرقم غير صحيح.</p>
            </div>
        );
    };
    return (
        <PropertyClient id={id} property={property} />
    );
};
export default PropertyDetails;

