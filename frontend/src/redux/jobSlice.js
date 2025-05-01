import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [], // Stores all jobs when no filters are applied
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    searchLocation: "",
    jobs: [], // Stores filtered jobs
    total: 0,
    page: 1,
    pages: 1,
    isLoading: false,
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setSearchLocation: (state, action) => {
      state.searchLocation = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
    clearFilters: (state) => {
      state.jobs = [];
      state.searchedQuery = "";
      state.page = 1;
      state.total = 0;
      state.pages = 1;
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSearchLocation,
  setJobs,
  setLoading,
  clearFilters,
} = jobSlice.actions;
export default jobSlice.reducer;