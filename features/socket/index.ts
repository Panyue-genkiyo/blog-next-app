import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";


const initialState: any = null;

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<Socket>) => {
            state = action.payload
        }
    },
})

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
