import classes from "./page.module.css";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import TitleAndDescription from "@/components/propertydetailscomponents/titleanddescription/titledescription";
import ImagesContainer from "@/components/propertydetailscomponents/imagescontainer/imagescontainer";
import Specifications from "@/components/propertydetailscomponents/specifications/specifications";
import Ownerdetails from "@/components/propertydetailscomponents/ownerdetails/ownerdetails";
import PropertyAmenities from "@/components/propertydetailscomponents/amenities/propertyamenities";
import PropertyVideo from "@/components/propertydetailscomponents/propertyvideo/propertyvideo";
import Statistics from "@/components/propertydetailscomponents/statistics/statistics";
import CommentsSection from "@/components/propertydetailscomponents/comments/comments";
import ContactInfo from "@/components/propertydetailscomponents/contactinfo/contactinfo";
import SimilarProperties from "@/components/propertydetailscomponents/similarproperties/similarproperties";
import EditBtns from "@/components/dashboard-components/property-edit-btns";
const PropertyDetails = async ({ params }) => {
    const { id } = await params;
    console.log(id);

    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return "UNAUTHORIZED";

    const property = await prisma.$transaction([
        prisma.property.findUnique({
            where: { id: parseInt(id) },
            include: {
                region: { include: { city: { include: { governorate: true } } } },
            }
        }),
        prisma.image.findMany({ where: { propertyId: parseInt(id) } }),
        prisma.propertyAmenity.findMany({
            where: { propertyId: parseInt(id) },
            include: { amenity: { select: { name: true } } }
        })
    ]);

    console.log(property);
    const propertyDetails = property[0];
    const images = property[1];
    const amenities = property[2]
    console.log(propertyDetails)

    return (
        <div className={`${classes.page}`}>


            <EditBtns id={id} state={propertyDetails.state} />
            <div className={classes.imagesanddescription}>
                <TitleAndDescription
                    id={propertyDetails.id}
                    title={propertyDetails.title}
                    purpose={propertyDetails.purpose}
                    desription={propertyDetails.description}
                />
                <ImagesContainer imagesFromDB={images} />
            </div>
            <div className={classes.specifications}>
                <Specifications
                    region={propertyDetails.region.name}
                    city={propertyDetails.region.city.name}
                    governorate={propertyDetails.region.city.governorate.name}
                    price={propertyDetails.price}
                    area={propertyDetails.area}
                    direction={propertyDetails.direction}
                    rooms={propertyDetails.rooms}
                    floor={propertyDetails.floor}
                />
                <Ownerdetails id={id} />
            </div>
            <PropertyAmenities info={amenities} />
            <PropertyVideo video={propertyDetails.video} />
            <Statistics id={id}
                views={propertyDetails.views}
                rating={propertyDetails.rating}
                numOfRaters={propertyDetails.numOfRaters}
                createdAt={propertyDetails.createdAt}
            />
            <CommentsSection id={id} />
            <ContactInfo id={id} contact={propertyDetails.contactInfo} />
            <SimilarProperties id={id} />
        </div>
    );
};
export default PropertyDetails;