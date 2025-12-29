import { createSlice } from "@reduxjs/toolkit";

const notifySlice = createSlice({
    name: 'notify',
    initialState: {
        active: false,
        key: ''
    },
    reducers:
    {
        setActive(state, action) {
            state.active = true;
            state.key = action.payload;
        },
        reset(state) {
            state.active = false,
                state.key = '';
        }
    }
});
export const { setActive, reset } = notifySlice.actions;
export default notifySlice.reducer;