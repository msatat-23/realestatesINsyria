import { createSlice } from "@reduxjs/toolkit";
const loggedInSlice = createSlice({
    name: 'loggedin',
    initialState: {
        loggedin: false,

    },
    reducers: {
        setLoggedIn(state) {
            state.loggedin = true;
        },
        logout(state) {
            state.loggedin = false;
        }
    }
})
export const { setLoggedIn, logout } = loggedInSlice.actions;
export default loggedInSlice.reducer;