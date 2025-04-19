// import { setAllJobs } from '@/redux/jobSlice';
// import { JOB_API_END_POINT } from '@/utils/constant';
// import axios from 'axios';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// const useGetAllJobs = () => {
//   const dispatch = useDispatch();
//   const { searchedQuery, searchLocation } = useSelector((store) => store.job);

//   useEffect(() => {
//     const fetchAllJobs = async () => {
//       try {
//         const res = await axios.get(
//           `${JOB_API_END_POINT}/get?keyword=${searchedQuery}&location=${searchLocation}`,
//           { withCredentials: true }
//         );
//         if (res.data.success) {
//           dispatch(setAllJobs(res.data.jobs));
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchAllJobs();
//   }, [searchedQuery, searchLocation, dispatch]);
// };

// export default useGetAllJobs;



import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery, searchLocation } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get`,
          { withCredentials: true }
        );
        console.log(res,"res")
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs || [])); // Ensure jobs is always an array
        } else {
          dispatch(setAllJobs([])); // Set empty array on failure
        }
      } catch (error) {
        console.log(error);
        dispatch(setAllJobs([])); // Handle network errors by setting empty state
      }
    };
    fetchAllJobs();
  }, [searchedQuery, searchLocation, dispatch]);
};

export default useGetAllJobs;