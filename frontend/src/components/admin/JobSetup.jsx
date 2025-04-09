import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetJobById from '@/hooks/useGetJobById';

const JobSetup = () => {
    const params = useParams();
    useGetJobById(params.id);

    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        experienceLevel: '',
        location: '',
        jobType: '',
        position: '',
        company: '',
        created_by: '',
        applications: [],
        createdAt: '',
        updatedAt: ''
    });

    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const changeEventHandler = (e) => {
        const { name, value } = e.target;

        if (name === 'salary' || name === 'position' || name === 'experienceLevel') {
            if (/^\d*$/.test(value) || value === '') {
                setInput({ ...input, [name]: value });
            }
        } else {
            setInput({ ...input, [name]: value });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const updatedFields = { ...input };

        console.log('Fields to update:', updatedFields);

        try {
            setLoading(true);

            const res = await axios.put(
                `${JOB_API_END_POINT}/update/${params.id}`,
                updatedFields,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/admin/jobs`);
            }
        } catch (error) {
            console.log('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleJob) {
            setInput({
                title: singleJob.title || '',
                description: singleJob.description || '',
                requirements: singleJob.requirements?.join(', ') || '',
                salary: singleJob.salary?.toString() || '',
                experienceLevel: singleJob.experienceLevel?.toString() || '',
                location: singleJob.location || '',
                jobType: singleJob.jobType || '',
                position: singleJob.position?.toString() || '',
                company: singleJob.company?.$oid || '',
                created_by: singleJob.created_by?.$oid || '',
                applications: singleJob.applications || [],
                createdAt: singleJob.createdAt || '',
                updatedAt: singleJob.updatedAt || ''
            });
        }
    }, [singleJob]);

    return (
        <div>
            <Navbar />
            <div className="max-w-xl mx-auto my-10">
                <form onSubmit={submitHandler}>
                    <div className="flex items-center gap-5 p-8">
                        <Button
                            onClick={() => navigate('/admin/jobs')}
                            variant="outline"
                            className="flex items-center gap-2 text-gray-500 font-semibold"
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className="font-bold text-xl">Job Setup</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Requirements (comma-separated)</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                placeholder="Enter salary"
                            />
                        </div>

                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                name="experienceLevel"
                                value={input.experienceLevel}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Company ID</Label>
                            <Input
                                type="text"
                                name="company"
                                value={input.company}
                                disabled
                            />
                        </div>

                        <div>
                            <Label>Created By (User ID)</Label>
                            <Input
                                type="text"
                                name="created_by"
                                value={input.created_by}
                                disabled
                            />
                        </div>

                        <div>
                            <Label>Applications Count</Label>
                            <Input
                                type="text"
                                value={input.applications.length}
                                disabled
                            />
                        </div>

                        <div>
                            <Label>Created At</Label>
                            <Input
                                type="text"
                                value={formatDate(input.createdAt)}
                                disabled
                            />
                        </div>

                        <div>
                            <Label>Updated At</Label>
                            <Input
                                type="text"
                                value={formatDate(input.updatedAt)}
                                disabled
                            />
                        </div>
                    </div>

                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Update
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default JobSetup;
