import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    name: '',
    image: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    profileImage: '',
    role: '',
    emailVerified: false,
    phone: '',
    subscription: '',
    until: '',
    hidePhone: false,
    hideEmail: false,
    hideFirstAndLast: false,
    createdAt: '',
    updatedAt: '',
    isTwoFactorEnabled: false,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:
    {
        setinfo(state, action) {
            return { ...state, ...action.payload };
        },
        resetinfo(state) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key];
            });
        }
    }
});
export const { setinfo, resetinfo } = userSlice.actions;
export default userSlice.reducer;