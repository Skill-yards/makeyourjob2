import { setAllJobs, setLoading } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        dispatch(setLoading(true));
        const params = {
          keyword: searchedQuery.keyword || '',
          location: searchedQuery.location || '',
        };
        const res = await axios.get(`${JOB_API_END_POINT}/get`, { params });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchJobs();
  }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;