import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        admin: null,
        isAuthenticated: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAdmin: (state, action) => {
            console.log("setAdmin: payload =", action.payload);
            state.admin = action.payload;
            state.isAuthenticated = !!action.payload;
            console.log("setAdmin: new state =", state);
        },
        clearAdmin: (state) => {
            state.admin = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setLoading, setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;