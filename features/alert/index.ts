import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IAlert} from "../../types/globalTypes";

const initialState: IAlert = {};

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<IAlert>) => action.payload
    }
});

export const { setAlert } = alertSlice.actions;
export default alertSlice.reducer;
