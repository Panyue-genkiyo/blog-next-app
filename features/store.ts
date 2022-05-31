import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme";
import authReducer from "./auth";
import alertReducer from "./alert";
import userLocationReducer from "./userlocation";
import picReducer from './picFile';
import socketReducer from "./socket";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        alert: alertReducer,
        userLocation: userLocationReducer,
        pic: picReducer,
        socket: socketReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
