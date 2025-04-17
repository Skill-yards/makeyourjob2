// import { createSlice } from "@reduxjs/toolkit";

// const jobSlice = createSlice({
//     name:"job",
//     initialState:{
//         allJobs:[],
//         allAdminJobs:[],
//         singleJob:null, 
//         searchJobByText:"",
//         allAppliedJobs:[],
//         searchedQuery:{ keyword: '', location: '' },
//         isLoading:false
//     },
//     reducers:{
//         // actions
//         setAllJobs:(state,action) => {
//             state.allJobs = action.payload;
//         },
//         setSingleJob:(state,action) => {
//             state.singleJob = action.payload;
//         },
//         setAllAdminJobs:(state,action) => {
//             state.allAdminJobs = action.payload;
//         },
//         setSearchJobByText:(state,action) => {
//             state.searchJobByText = action.payload;
//         },
//         setAllAppliedJobs:(state,action) => {
//             state.allAppliedJobs = action.payload;
//         },
//         setSearchedQuery:(state,action) => {
//             state.searchedQuery = action.payload;
//         }
//     }
// });
// export const {
//     setAllJobs, 
//     setSingleJob, 
//     setAllAdminJobs,
//     setSearchJobByText, 
//     setAllAppliedJobs,
//     setSearchedQuery,
//     setLoading
// } = jobSlice.actions;
// export default jobSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    allJobs: [],
    isLoading: false,
    searchedQuery: { keyword: '', location: '' },
  },
  reducers: {
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSearchedQuery, setAllJobs, setLoading } = jobSlice.actions;
export default jobSlice.reducer;