import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    q: '',
    min_price: '',
    max_price: '',
    governorate: '',
    city: '',
    region: '',
    property_type: '',
    property_status: 'بيع',
    min_area: '',
    max_area: '',
    minroomsNum: '',
    maxroomsNum: '',
    floor: ''
};

const advancedSearchSlice = createSlice({
    name: 'advancedsearch',
    initialState,
    reducers: {
        updateField: (state, action) => {
            state[action.payload.field] = action.payload.value;
        },
        resetfields: () =>
            initialState

    }

});

export const { updateField, resetfields } = advancedSearchSlice.actions;
export default advancedSearchSlice.reducer;