import { createSlice } from "@reduxjs/toolkit";

export const Theme = createSlice({
    name: 'ThemeStore',
    initialState: {
        theme: 'light'
    },

    reducers: {
        SetTheme : (state,action) => {
            console.log('---THEME CHANGE Store Update---')
            state.theme = action.payload
        }
    }
})

export const {
    SetTheme
} = Theme.actions

export default Theme.reducer