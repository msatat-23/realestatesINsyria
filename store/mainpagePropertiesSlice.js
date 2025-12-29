import { createSlice } from "@reduxjs/toolkit";
const mainpagePropertiesSlice = createSlice({
    name: 'mainproperties',
    initialState: {
        allProperties: [],
        exclusiveProperties: [],
        specialProperties: []
    },
    reducers: {
        setProperties(state, action) {
            state.allProperties = action.payload;
            state.exclusiveProperties = action.payload.filter(property => property.sub_type === 'حصري');
            state.specialProperties = action.payload.filter(property => property.sub_type === 'مميز');
        }
    }
})
export const { setProperties } = mainpagePropertiesSlice.actions;
export default mainpagePropertiesSlice.reducer;