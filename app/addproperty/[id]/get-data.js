"use server"

import {
    getGovernorateCities,
    getCityRegions,
    getPropertyTypes,
    getPropertyPurposes,
    getPropertyStatuses,
    getAllGovernorates,
    getPropertyDirections,
    getCityByRegionId,
    getGovernorateByCityId,
    getRegionByRegionId,
    getAllAmenities,
} from "@/data/property/constant-data";
import { getMoreProperties } from "@/data/property/home-feed-properties";
import { getImagePublicIdBySecureUrl, getPropertyAmenities, getPropertyDetails, getPropertyFirstImage, getPropertyImages, getVideoPublicId } from "@/data/property/property-details";
import { getVideoSecureUrl } from "@/data/property/property-details";
import { fetchSavedPropertiesByUserId } from "@/data/property/saved-properties";
export const getFullDetails = async (id) => {
    const details = await getPropertyDetails(id);
    return JSON.stringify(details);
}
export const getStartingData = async () => {
    const types = getPropertyTypes();
    const purposes = getPropertyPurposes();
    const statuses = getPropertyStatuses();
    const directions = getPropertyDirections();
    const governorates = await getAllGovernorates();
    return { types, purposes, statuses, governorates, directions };
};
export const getGovernoratesServer = async () => {
    const governorates = await getAllGovernorates();;
    return governorates;
};
export const getCities = async (governorateId) => {
    const cities = await getGovernorateCities(governorateId);
    return cities;
};
export const getRegions = async (cityId) => {
    const regions = await getCityRegions(cityId);
    return regions;
};
export const getRegion = async (regionId) => {
    const region = await getRegionByRegionId(regionId);
    return region;
}
export const getCity = async (regionId) => {
    const city = await getCityByRegionId(regionId);
    return city;
};
export const getGovernorate = async (cityId) => {
    const governorate = await getGovernorateByCityId(cityId);
    return governorate;
};
export const getVideoSecureUrlByPropertyId = async (id) => {
    console.log("IAM IN SERVER TRYING TO FETCH VID URL!!!!");
    const property = await getVideoSecureUrl(id);
    return property;
}
export const getVideoPublicIdUrlByPropertyId = async (id) => {
    console.log("IAM IN SERVER TRYING TO FETCH VID PUBLIC_ID!!!!");
    const property = await getVideoPublicId(id);
    return property;
}
export const getImagesSecureUrl = async (id) => {
    console.log("IAM IN SERVER TRYING TO FETCH IMAGES SECURE_URL!!!");
    const images = await getPropertyImages(id);
    return images;
}
export const getFirstImageSecureUrl = async (id) => {
    console.log("IAM IN SERVER TRYING TO FETCH IMAGE SECURE_URL!!!");
    const image = await getPropertyFirstImage(id);
    return image;
}
export const getIdBySecureUrl = async (secure_url) => {
    console.log("IAM IN SERVER TRYING TO FETCH PUBLIC_ID!!!");
    const image = await getImagePublicIdBySecureUrl(secure_url);
    return image;
}
export const getAmenities = async () => {
    console.log("IAM IN SERVER TRYING TO FETCH AMENITIES!!");
    const amenities = await getAllAmenities();
    return amenities;
}
export const getAllPropertyAmenities = async (propertyId) => {
    console.log("IAM IN SERVER TRYING TO FETCH PROPERTY AMENITIES!!");
    const amenities = await getPropertyAmenities(propertyId);
    return amenities;
}
export const fetchSavedProperties = async (userId) => {
    console.log("IAM IN SERVER TRYING TO FETCH SAVEDPROPRETIES BY USER ID!!!");
    const res = await fetchSavedPropertiesByUserId(userId);
    return res;
};
export const getMorePropertiesServer = async (more) => {
    console.log("IAM IN SERVER TRYING TO FETCH MoreProperties!!!");
    const res = await getMoreProperties(more);
    return res;
}