import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Job Type</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => {
                        const { _id, company, title, salary, experienceLevel, location, jobType, position, applications, createdAt, updatedAt } = job;
                        return (
                            <TableRow key={_id}>
                                {/* Company Details */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {company?.logo && (
                                            <Avatar>
                                                <AvatarImage src={company?.logo} alt={company?.name} />
                                            </Avatar>
                                        )}
                                        <span>{company?.name || 'N/A'}</span>
                                    </div>
                                </TableCell>
                                {/* Job Details */}
                                <TableCell>
                                    <Link to={`/admin/jobs/${_id}`} className="text-blue-600 hover:underline">
                                        {title}
                                    </Link>
                                </TableCell>
                                <TableCell>{salary ? `$${salary}k` : 'N/A'}</TableCell>
                                <TableCell>{experienceLevel ? `${experienceLevel} years` : 'N/A'}</TableCell>
                                <TableCell>{location || 'N/A'}</TableCell>
                                <TableCell>{jobType || 'N/A'}</TableCell>
                                <TableCell>{position || 'N/A'}</TableCell>
                                <TableCell>{applications?.length || 0}</TableCell>
                                <TableCell>{formatDate(createdAt)}</TableCell>
                                <TableCell>{formatDate(updatedAt)}</TableCell>
                                {/* Action Buttons */}
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div
                                                onClick={() => navigate(`/admin/jobs/${_id}/update`)}
                                                className="flex items-center gap-2 w-fit cursor-pointer"
                                            >
                                                <Edit2 className="w-4" />
                                                <span>Edit</span>
                                            </div>
                                            <div
                                                onClick={() => navigate(`/admin/jobs/${_id}/applicants`)}
                                                className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                                            >
                                                <Eye className="w-4" />
                                                <span>Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;