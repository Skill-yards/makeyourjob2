import { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';

const AdminJobs = () => {
    useGetAllAdminJobs();
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchJobByText(input));
    }, [input]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between my-5">
                    <Input
                        className="w-1/3 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm rounded-lg"
                        placeholder="Filter by title, company, or role"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                        onClick={() => navigate('/admin/jobs/create')}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md rounded-lg"
                    >
                        New Job
                    </Button>
                </div>
                <AdminJobsTable />
            </div>
        </div>
    );
};

export default AdminJobs;