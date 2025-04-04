import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PostJob = () => {
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experienceLevel: '',   // 👈 Added experienceLevel
        position: '',
        companyId: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.title || !input.description || !input.requirements || !input.salary || !input.location || !input.jobType || !input.experienceLevel || !input.position || !input.companyId) {
            toast.error('Please fill all fields before submitting.');
            return;
        }

        const formattedRequirements = input.requirements
            .split(',')
            .map(req => req.trim())
            .filter(Boolean);

        const payload = {
            ...input,
            requirements: formattedRequirements
        };

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            } else {
                toast.error(res.data.message || 'Failed to post job');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            toast.error(error.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Title</Label>
                            <Input type='text' name='title' value={input.title} onChange={changeEventHandler} required />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input type='text' name='description' value={input.description} onChange={changeEventHandler} required />
                        </div>
                        <div>
                            <Label>Requirements (comma-separated)</Label>
                            <Input type='text' name='requirements' value={input.requirements} onChange={changeEventHandler} placeholder='e.g., React, Node.js, MongoDB' required />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input type='text' name='salary' value={input.salary} onChange={changeEventHandler} required />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input type='text' name='location' value={input.location} onChange={changeEventHandler} required />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input type='text' name='jobType' value={input.jobType} onChange={changeEventHandler} required />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input type='text' name='experienceLevel' value={input.experienceLevel} onChange={changeEventHandler} placeholder='e.g., 3+ years, Entry-level' required />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input type='text' name='position' value={input.position} onChange={changeEventHandler} required />
                        </div>
                        {
                            companies.length > 0 && (
                                <div className="col-span-2">
                                    <Label>Select Company</Label>
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Company' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {companies.map((company) => (
                                                    <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                    {
                        loading ? (
                            <Button className='w-full my-4' disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type='submit' className='w-full my-4'>
                                Post New Job
                            </Button>
                        )
                    }
                </form>
            </div>
        </div>
    );
};

export default PostJob;