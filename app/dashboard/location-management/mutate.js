"use server"

const { addGovernorate, deleteGovernorate, addCity, deleteCity, addRegion, deleteRegion } = require("@/data/dashboard/location");


export const addGovernorateServer = async (name) => {
    const res = await addGovernorate(name);
    return res;
};
export const deleteGovernorateServer = async (id) => {
    const res = await deleteGovernorate(id);
    return res;
};
export const addCityServer = async (name, governorateId) => {
    const res = await addCity(name, governorateId);
    return res;
};
export const deleteCityServer = async (id) => {
    const res = await deleteCity(id);
    return res;
};
export const addRegionServer = async (name, cityId) => {
    const res = await addRegion(name, cityId);
    return res;
};
export const deleteRegionServer = async (id) => {
    const res = await deleteRegion(id);
    return res;
};