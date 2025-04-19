// import { createSlice } from "@reduxjs/toolkit";

// const jobSlice = createSlice({
//   name: "job",
//   initialState: {
//     allJobs: [],
//     allAdminJobs: [],
//     singleJob: null,
//     searchJobByText: "",
//     allAppliedJobs: [],
//     searchedQuery: "",
//     searchLocation: "", // New field for location
//   },
//   reducers: {
//     setAllJobs: (state, action) => {
//       state.allJobs = action.payload;
//     },
//     setSingleJob: (state, action) => {
//       state.singleJob = action.payload;
//     },
//     setAllAdminJobs: (state, action) => {
//       state.allAdminJobs = action.payload;
//     },
//     setSearchJobByText: (state, action) => {
//       state.searchJobByText = action.payload;
//     },
//     setAllAppliedJobs: (state, action) => {
//       state.allAppliedJobs = action.payload;
//     },
//     setSearchedQuery: (state, action) => {
//       state.searchedQuery = action.payload;
//     },
//     setSearchLocation: (state, action) => {
//       state.searchLocation = action.payload;
//     },
//   },
// });

// export const {
//   setAllJobs,
//   setSingleJob,
//   setAllAdminJobs,
//   setSearchJobByText,
//   setAllAppliedJobs,
//   setSearchedQuery,
//   setSearchLocation,
// } = jobSlice.actions;
// export default jobSlice.reducer;






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
    searchLocation: "", // New field for location
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
} = jobSlice.actions;
export default jobSlice.reducer;