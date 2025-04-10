import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) return true;
            const searchText = searchJobByText.toLowerCase();
            return (
                job?.title?.toLowerCase().includes(searchText) ||
                job?.jobTitle?.toLowerCase().includes(searchText) ||
                job?.companyName?.toLowerCase().includes(searchText)
            );
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getSalaryDisplay = (job) => {
        if (job.salaryRangeDiversity?.min && job.salaryRangeDiversity?.max) {
            return `${job.salaryRangeDiversity.min} - ${job.salaryRangeDiversity.max} ${job.salaryRangeDiversity.currency} (${job.salaryRangeDiversity.frequency})`;
        }
        return job.salary || 'N/A';
    };

    return (
        <div className="space-y-6">
            <Table className="bg-white shadow-xl rounded-2xl border border-gray-200">
                <TableCaption className="text-gray-600">A list of your recently posted jobs</TableCaption>
                <TableHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
                    <TableRow>
                        <TableHead className="text-white">Company</TableHead>
                        <TableHead className="text-white">Title</TableHead>
                        <TableHead className="text-white">Salary</TableHead>
                        <TableHead className="text-white">Experience</TableHead>
                        <TableHead className="text-white">Location</TableHead>
                        <TableHead className="text-white">Job Type</TableHead>
                        <TableHead className="text-white">Vacancies</TableHead>
                        <TableHead className="text-white">Applications</TableHead>
                        <TableHead className="text-white">Created At</TableHead>
                        <TableHead className="text-white text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow
                            key={job._id}
                            className="hover:bg-indigo-50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/admin/jobs/${job._id}`)}
                        >
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {job?.company?.logo && (
                                        <Avatar>
                                            <AvatarImage src={job.company.logo} alt={job.companyName} />
                                        </Avatar>
                                    )}
                                    <span className="text-gray-800">{job.companyName || job.company?.name || 'N/A'}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-blue-600 hover:underline">{job.title || job.jobTitle || 'N/A'}</span>
                            </TableCell>
                            <TableCell>{getSalaryDisplay(job)}</TableCell>
                            <TableCell>{job.experienceLevel || 'N/A'}</TableCell>
                            <TableCell>{job.workLocation?.city || job.location || 'N/A'}</TableCell>
                            <TableCell>{job.jobType || 'N/A'}</TableCell>
                            <TableCell>{job.vacancies || job.position || 'N/A'}</TableCell>
                            <TableCell>{job.applications?.length || 0}</TableCell>
                            <TableCell>{formatDate(job.createdAt)}</TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                                        <MoreHorizontal className="text-gray-600 hover:text-indigo-600" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/jobs/${job._id}/update`);
                                            }}
                                            className="flex items-center gap-2 w-fit cursor-pointer hover:text-indigo-600"
                                        >
                                            <Edit2 className="w-4" />
                                            <span>Edit</span>
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/jobs/${job._id}/applicants`);
                                            }}
                                            className="flex items-center w-fit gap-2 cursor-pointer mt-2 hover:text-indigo-600"
                                        >
                                            <Eye className="w-4" />
                                            <span>Applicants</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;