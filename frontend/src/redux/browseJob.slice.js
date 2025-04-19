import { createSlice } from "@reduxjs/toolkit";

const jobBrowseSlice = createSlice({
  name: "jobBrowse",
  initialState: {
    searchedJobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    searchJobsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSearchedJobs: (state, action) => {
      state.searchedJobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    searchJobsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetSearchJobs: (state) => {
      state.searchedJobs = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  searchJobsStart,
  setSearchedJobs,
  searchJobsFailure,
  resetSearchJobs,
} = jobBrowseSlice.actions;

export default jobBrowseSlice.reducer;
