"use client";
import { Provider, useDispatch } from "react-redux";
import { setinfo } from "./userSlice";
import store from './index';
import { useEffect } from "react";

export function ReduxProvider({ children, session }) {

    const SessionUpdater = () => {
        const dispatch = useDispatch();
        useEffect(() => {
            if (session?.user) {
                dispatch(setinfo({ ...session.user }));
            }
        }, [session, dispatch]);
    }

    return <Provider store={store}>
        <SessionUpdater />
        {children}
    </Provider>;
}