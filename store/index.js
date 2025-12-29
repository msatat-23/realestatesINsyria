import { configureStore } from "@reduxjs/toolkit";
import mainpagepropertiesSlice from "./mainpagePropertiesSlice";
import loggedInSlice from "./loggedInSlice";
import userSlice from "./userSlice";
import advancedSearchSlice from "./advancedsearchSlice";
import notifySlice from "./notifySlice";

const store = configureStore({
    reducer: {
        mainproperties: mainpagepropertiesSlice,
        loggedin: loggedInSlice,
        user: userSlice,
        advancedsearch: advancedSearchSlice,
        notify: notifySlice
    }
});

export default store;