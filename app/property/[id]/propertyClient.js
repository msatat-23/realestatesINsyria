import classes from './page.module.css';
import { Readex_Pro } from 'next/font/google';
import Navbar from '@/components/navbar/navbar';
import ImagesContainer from "@/components/propertydetailscomponents/imagescontainer/imagescontainer";
import TitleAndDescription from '@/components/propertydetailscomponents/titleanddescription/titledescription';
import Specifications from '@/components/propertydetailscomponents/specifications/specifications';
import Ownerdetails from '@/components/propertydetailscomponents/ownerdetails/ownerdetails';
import PropertyAmenities from '@/components/propertydetailscomponents/amenities/propertyamenities';
import PropertyVideo from '@/components/propertydetailscomponents/propertyvideo/propertyvideo';
import Statistics from '@/components/propertydetailscomponents/statistics/statistics';
import CommentsSection from '@/components/propertydetailscomponents/comments/comments';
import ContactInfo from '@/components/propertydetailscomponents/contactinfo/contactinfo';
import SimilarProperties from '@/components/propertydetailscomponents/similarproperties/similarproperties';
import Footer from '@/components/footer/footer';

const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });



const PropertyClient = async ({ id, property }) => {

    const propertyDetails = property[0];
    const images = property[1];
    const amenities = property[2]


    return (
        <div className={`${classes.global} ${Readex_Pro_Font.className}`}>
            <Navbar mainpage={false} />
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
            <Footer />
        </div>
    );
};
export default PropertyClient;

