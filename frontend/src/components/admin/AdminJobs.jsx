// File: components/admin/AdminJobs.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import Navbar from '../shared/Navbar';
import AdminJobsTable from './AdminJobsTable';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, BriefcaseBusiness, ArrowLeft } from 'lucide-react';
import Footer from '../shared/Footer';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [searchInput, setSearchInput] = useState('');
  const [companyStatus, setCompanyStatus] = useState(null); // Store single status (string or null)
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch company status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/companies/status`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log('API Response:', res.data); // Debug response
        setCompanyStatus(res.data.status || null); // Set status (e.g., "active", "rejected", or null)
      } catch (error) {
        console.error('Error fetching company status:', error);
        setCompanyStatus(null); // Set to null on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  // Log companyStatus after state update
  useEffect(() => {
    console.log('companyStatus:', companyStatus);
  }, [companyStatus]);

  // Check if company is active
  const hasActiveCompany = companyStatus === 'active';

  // Log hasActiveCompany for debugging
  useEffect(() => {
    console.log('hasActiveCompany:', hasActiveCompany);
  }, [companyStatus]);

  useEffect(() => {
    dispatch(setSearchJobByText(searchInput));
  }, [searchInput, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <span className="p-5 cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft color="blue" />
        </span>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-100">
                <BriefcaseBusiness className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Job Management
              </CardTitle>
              <Button
                onClick={() => navigate('/admin/jobs/create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto shadow transition-all"
                disabled={isLoading || !hasActiveCompany}
                title={
                  !hasActiveCompany && !isLoading
                    ? 'Please verify company with admin '
                    : ''
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {!hasActiveCompany && !isLoading && (
              <p className="text-red-500 mb-4">
                Please verify company with admin.
              </p>
            )}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm w-full md:w-1/2 lg:w-1/3"
                placeholder="Filter by title, company, or role"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <AdminJobsTable />
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AdminJobs;
