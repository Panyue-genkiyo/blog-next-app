import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { picState, pic } from "../../types/rd-types/picTypes";

const initialState: picState = {
    profilePic: {
        file: null,
        url: null,
    },
    profileBlogThumbnail: {
        file: null,
        url: null,
    },
    thumbnail: {
        file: null,
        url: null,
    },
}

const picSlice = createSlice({
   name: 'pic',
   initialState,
   reducers: {
       setProfilePic: (state, action: PayloadAction<pic>) => {
           state.profilePic = action.payload;
       },
       setProfileBlogThumbnail: (state, action: PayloadAction<pic>) => {
           state.profileBlogThumbnail = action.payload;
       },
       setThumbnail: (state, action: PayloadAction<pic>) => {
           state.thumbnail = action.payload;
       },
   }
});

export const { setProfilePic, setProfileBlogThumbnail, setThumbnail } = picSlice.actions;
export default picSlice.reducer;
