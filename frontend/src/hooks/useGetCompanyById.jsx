<<<<<<< HEAD
import { setSingleCompany } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
=======
import { setSingleCompany } from '@/redux/companySlice'
// import { setAllJobs } from '@/redux/jobSlice'
import { COMPANY_API_END_POINT} from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
>>>>>>> 94a8160a551efd4c82bfc07f7aab69d68a15bd35

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.error("Error fetching company by ID:", error);
        dispatch(setSingleCompany(null)); // Clear single company if fetch fails (e.g., deleted)
      }
    };
    if (companyId) {
      fetchSingleCompany();
    }
  }, [companyId, dispatch]);
};

export default useGetCompanyById;