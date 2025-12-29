import classes from './similarproperties.module.css';
import Property from '@/components/property/property';
import prisma from '@/lib/prisma';
import { Fragment } from 'react';

const SimilarProperties = async ({ id }) => {
    const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
        select: { propertyType: true, regionId: true, region: { select: { cityId: true, name: true, city: { select: { governorateId: true, name: true, governorate: { select: { name: true } } } } } } }
    });
    const similar = await prisma.property.findMany({
        where: {
            id: { not: property.id },
            propertyType: property.propertyType,
            OR: [
                { regionId: property.regionId },
                { region: { cityId: property.region.cityId } },
                { region: { city: { governorateId: property.region.city.governorateId } } }
            ]
        },
        select: {
            id: true,
            title: true,
            description: true,
            purpose: true,
            state: true,
            propertyType: true,
            price: true,
            area: true,
            region: { select: { city: { select: { name: true } }, name: true } },
            subscription: true,
            createdAt: true
        }
    });
    return (<Fragment>
        {similar.length > 0 && <h1 className={classes.h1}>عقارات مشابهة</h1>}
        <div className={classes.container}>
            {similar.map((property) => {
                return (<Property key={property.id}  {...property} />);
            })}
        </div></Fragment>)

}
export default SimilarProperties;