import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        loading: false,      // Added loading state
        error: null          // Added error state
    },
    reducers: {
        // Existing actions
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
            state.loading = false;
            state.error = null;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        
        // New error handling actions
        setJobLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setJobError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearJobError: (state) => {
            state.error = null;
        }
    }
});

// Export all action creators
export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setJobLoading,
    setJobError,
    clearJobError
} = jobSlice.actions;

export default jobSlice.reducer;