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
        if (res.data.success) {
          console.log(res.data,'job details from addd')
          dispatch(setAllJobs(res.data.jobs || []));
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