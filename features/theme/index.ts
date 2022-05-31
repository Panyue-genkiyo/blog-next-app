import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: boolean = typeof window !== 'undefined' && ( localStorage.getItem('theme') === 'true');


const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        //toggle theme
        setTheme: (state, action: PayloadAction<boolean>) => {
            state = action.payload;
            localStorage.setItem('theme', state.toString());
            return state;
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

