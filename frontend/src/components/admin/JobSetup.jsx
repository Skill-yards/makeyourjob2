import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetJobById from '@/hooks/useGetJobById';

const JobSetup = () => {
    const params = useParams();
    useGetJobById(params.id);
    const { singleJob } = useSelector((store) => store.job);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [input, setInput] = useState({
        title: '',
        jobTitle: '',
        description: '',
        requirements: '',
        salary: '',
        salaryRangeDiversity: { min: '', max: '', currency: 'USD', frequency: 'yearly' },
        experienceLevel: '',
        location: '',
        workLocation: { city: '', state: '', country: '' },
        jobType: '',
        position: '',
        companyName: '',
        jobNature: '',
        workplacePlane: '',
        jobCategory: '',
        skills: '',
        availabilityFrame: { startDate: '', endDate: '' },
        status: '',
        postedDate: '',
        deadline: '',
        vacancies: '',
        benefits: '',
        educationLevel: '',
        keywords: '',
    });

    const [errors, setErrors] = useState({});

    const validateInput = () => {
        const newErrors = {};

        if (!input.title || input.title.length < 3) newErrors.title = 'Title is required (min 3 chars).';
        if (!input.jobTitle || input.jobTitle.length < 3) newErrors.jobTitle = 'Job title is required (min 3 chars).';
        if (!input.description || input.description.length < 10) newErrors.description = 'Description is required (min 10 chars).';
        if (!input.salary) newErrors.salary = 'Salary is required.';
        if (!input.companyName) newErrors.companyName = 'Company name is required.';
        if (input.salaryRangeDiversity.min && !/^\d+$/.test(input.salaryRangeDiversity.min)) newErrors['salaryRangeDiversity.min'] = 'Min salary must be a number.';
        if (input.salaryRangeDiversity.max && !/^\d+$/.test(input.salaryRangeDiversity.max)) newErrors['salaryRangeDiversity.max'] = 'Max salary must be a number.';
        if (input.salaryRangeDiversity.min && input.salaryRangeDiversity.max && Number(input.salaryRangeDiversity.min) >= Number(input.salaryRangeDiversity.max)) {
            newErrors['salaryRangeDiversity.max'] = 'Max salary must be greater than min.';
        }
        if (!input.experienceLevel) newErrors.experienceLevel = 'Experience level is required.';
        if (!input.location) newErrors.location = 'Location is required.';
        if (!input.jobType) newErrors.jobType = 'Job type is required.';
        if (!input.position) newErrors.position = 'Position is required.';
        if (!input.workLocation.country) newErrors['workLocation.country'] = 'Country is required.';
        if (!input.jobNature) newErrors.jobNature = 'Job nature is required.';
        if (!input.workplacePlane) newErrors.workplacePlane = 'Workplace type is required.';
        if (!input.jobCategory) newErrors.jobCategory = 'Job category is required.';
        if (!input.skills) newErrors.skills = 'At least one skill is required.';
        if (!input.availabilityFrame.startDate) newErrors['availabilityFrame.startDate'] = 'Start date is required.';
        if (input.vacancies && (!/^\d+$/.test(input.vacancies) || Number(input.vacancies) < 1)) newErrors.vacancies = 'Vacancies must be a positive number.';
        if (input.deadline && new Date(input.deadline) < new Date()) newErrors.deadline = 'Deadline must be in the future.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setInput({
                ...input,
                [parent]: { ...input[parent], [child]: value },
            });
        } else {
            setInput({ ...input, [name]: value });
        }
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    const selectChangeHandler = (name, value) => {
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setInput({
                ...input,
                [parent]: { ...input[parent], [child]: value },
            });
        } else {
            setInput({ ...input, [name]: value });
        }
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateInput()) {
            toast.error('Please fix the errors in the form.');
            return;
        }

        const updatedFields = {
            title: input.title,
            jobTitle: input.jobTitle,
            description: input.description,
            requirements: input.requirements,
            salary: input.salary,
            salaryRangeDiversity: {
                min: input.salaryRangeDiversity.min,
                max: input.salaryRangeDiversity.max,
                currency: input.salaryRangeDiversity.currency,
                frequency: input.salaryRangeDiversity.frequency,
            },
            experienceLevel: input.experienceLevel,
            location: input.location,
            workLocation: {
                city: input.workLocation.city,
                state: input.workLocation.state,
                country: input.workLocation.country,
            },
            jobType: input.jobType,
            position: input.position,
            companyName: input.companyName,
            jobNature: input.jobNature,
            workplacePlane: input.workplacePlane,
            jobCategory: input.jobCategory,
            skills: input.skills,
            availabilityFrame: {
                startDate: input.availabilityFrame.startDate,
                endDate: input.availabilityFrame.endDate || undefined,
            },
            status: input.status,
            deadline: input.deadline || undefined,
            vacancies: input.vacancies,
            benefits: input.benefits,
            educationLevel: input.educationLevel,
            keywords: input.keywords,
        };

        Object.keys(updatedFields).forEach((key) => {
            if (updatedFields[key] === '' || updatedFields[key] === undefined) {
                delete updatedFields[key];
            } else if (typeof updatedFields[key] === 'object' && updatedFields[key] !== null) {
                Object.keys(updatedFields[key]).forEach((subKey) => {
                    if (updatedFields[key][subKey] === '' || updatedFields[key][subKey] === undefined) {
                        delete updatedFields[key][subKey];
                    }
                });
                if (Object.keys(updatedFields[key]).length === 0) {
                    delete updatedFields[key];
                }
            }
        });

        try {
            setLoading(true);
            const res = await axios.put(
                `${JOB_API_END_POINT}/update/${params.id}`,
                updatedFields,
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Failed to update job';
            const errorDetails = error.response?.data?.errors || [];
            setErrors(errorDetails.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {}));
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (singleJob) {
            setInput({
                title: singleJob.title || '',
                jobTitle: singleJob.jobTitle || singleJob.title || '',
                description: singleJob.description || '',
                requirements: singleJob.requirements?.join(', ') || '',
                salary: singleJob.salary || '',
                salaryRangeDiversity: {
                    min: singleJob.salaryRangeDiversity?.min?.toString() || '',
                    max: singleJob.salaryRangeDiversity?.max?.toString() || '',
                    currency: singleJob.salaryRangeDiversity?.currency || 'USD',
                    frequency: singleJob.salaryRangeDiversity?.frequency || 'yearly',
                },
                experienceLevel: singleJob.experienceLevel || '',
                location: singleJob.location || '',
                workLocation: {
                    city: singleJob.workLocation?.city || '',
                    state: singleJob.workLocation?.state || '',
                    country: singleJob.workLocation?.country || '',
                },
                jobType: singleJob.jobType || '',
                position: singleJob.position || '',
                companyName: singleJob.companyName || singleJob.company?.name || '',
                jobNature: singleJob.jobNature || '',
                workplacePlane: singleJob.workplacePlane || '',
                jobCategory: singleJob.jobCategory || '',
                skills: singleJob.skills?.join(', ') || '',
                availabilityFrame: {
                    startDate: formatDate(singleJob.availabilityFrame?.startDate) || '',
                    endDate: formatDate(singleJob.availabilityFrame?.endDate) || '',
                },
                status: singleJob.status || '',
                postedDate: formatDate(singleJob.postedDate) || '',
                deadline: formatDate(singleJob.deadline) || '',
                vacancies: singleJob.vacancies?.toString() || '',
                benefits: singleJob.benefits?.join(', ') || '',
                educationLevel: singleJob.educationLevel || '',
                keywords: singleJob.keywords?.join(', ') || '',
            });
        }
    }, [singleJob]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-20"></div>
                    <CardHeader className="relative pt-6 pb-4 px-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-semibold text-gray-800">Job Setup</CardTitle>
                            <Button
                                onClick={() => navigate('/admin/jobs')}
                                variant="outline"
                                className="flex items-center gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.title ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Software Engineer"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
                                    <Input
                                        id="jobTitle"
                                        type="text"
                                        name="jobTitle"
                                        value={input.jobTitle}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.jobTitle ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
                                    <Input
                                        id="companyName"
                                        type="text"
                                        name="companyName"
                                        value={input.companyName}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.companyName ? 'border-red-500' : ''}`}
                                        placeholder="e.g., TechCorp"
                                    />
                                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Develop and maintain web applications..."
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">Requirements (comma-separated)</Label>
                                    <Input
                                        id="requirements"
                                        type="text"
                                        name="requirements"
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., JavaScript, React"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="skills" className="text-sm font-medium text-gray-700">Skills (comma-separated)</Label>
                                    <Input
                                        id="skills"
                                        type="text"
                                        name="skills"
                                        value={input.skills}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.skills ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Node.js, MongoDB"
                                    />
                                    {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="salary" className="text-sm font-medium text-gray-700">Salary (legacy)</Label>
                                    <Input
                                        id="salary"
                                        type="text"
                                        name="salary"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.salary ? 'border-red-500' : ''}`}
                                        placeholder="e.g., $50,000 - $70,000"
                                    />
                                    {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="salaryMin" className="text-sm font-medium text-gray-700">Salary Min</Label>
                                    <Input
                                        id="salaryMin"
                                        type="number"
                                        name="salaryRangeDiversity.min"
                                        value={input.salaryRangeDiversity.min}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['salaryRangeDiversity.min'] ? 'border-red-500' : ''}`}
                                        placeholder="e.g., 50000"
                                    />
                                    {errors['salaryRangeDiversity.min'] && <p className="text-red-500 text-xs mt-1">{errors['salaryRangeDiversity.min']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="salaryMax" className="text-sm font-medium text-gray-700">Salary Max</Label>
                                    <Input
                                        id="salaryMax"
                                        type="number"
                                        name="salaryRangeDiversity.max"
                                        value={input.salaryRangeDiversity.max}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['salaryRangeDiversity.max'] ? 'border-red-500' : ''}`}
                                        placeholder="e.g., 70000"
                                    />
                                    {errors['salaryRangeDiversity.max'] && <p className="text-red-500 text-xs mt-1">{errors['salaryRangeDiversity.max']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                                    <Select
                                        value={input.salaryRangeDiversity.currency}
                                        onValueChange={(value) => selectChangeHandler('salaryRangeDiversity.currency', value)}
                                    >
                                        <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['USD', 'INR', 'EUR', 'GBP'].map((currency) => (
                                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">Frequency</Label>
                                    <Select
                                        value={input.salaryRangeDiversity.frequency}
                                        onValueChange={(value) => selectChangeHandler('salaryRangeDiversity.frequency', value)}
                                    >
                                        <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                            <SelectValue placeholder="Select Frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['hourly', 'monthly', 'yearly'].map((freq) => (
                                                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">Experience Level</Label>
                                    <Select
                                        value={input.experienceLevel}
                                        onValueChange={(value) => selectChangeHandler('experienceLevel', value)}
                                    >
                                        <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.experienceLevel ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Experience Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Expert'].map((level) => (
                                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.experienceLevel && <p className="text-red-500 text-xs mt-1">{errors.experienceLevel}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location (legacy)</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.location ? 'border-red-500' : ''}`}
                                        placeholder="e.g., New York, USA"
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        name="workLocation.city"
                                        value={input.workLocation.city}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., New York"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                                    <Input
                                        id="state"
                                        type="text"
                                        name="workLocation.state"
                                        value={input.workLocation.state}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., NY"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                                    <Input
                                        id="country"
                                        type="text"
                                        name="workLocation.country"
                                        value={input.workLocation.country}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['workLocation.country'] ? 'border-red-500' : ''}`}
                                        placeholder="e.g., USA"
                                    />
                                    {errors['workLocation.country'] && <p className="text-red-500 text-xs mt-1">{errors['workLocation.country']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">Job Type</Label>
                                    <Select
                                        value={input.jobType}
                                        onValueChange={(value) => selectChangeHandler('jobType', value)}
                                    >
                                        <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.jobType ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Job Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Internship', 'Freelance'].map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">Position</Label>
                                    <Input
                                        id="position"
                                        type="text"
                                        name="position"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.position ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Developer"
                                    />
                                    {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="jobNature" className="text-sm font-medium text-gray-700">Job Nature</Label>
                                    <Select
                                        value={input.jobNature}
                                        onValueChange={(value) => selectChangeHandler('jobNature', value)}
                                    >
                                        <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.jobNature ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Job Nature" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Permanent', 'Temporary', 'Seasonal', 'Project-Based'].map((nature) => (
                                                <SelectItem key={nature} value={nature}>{nature}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jobNature && <p className="text-red-500 text-xs mt-1">{errors.jobNature}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="workplacePlane" className="text-sm font-medium text-gray-700">Workplace Type</Label>
                                    <Select
                                        value={input.workplacePlane}
                                        onValueChange={(value) => selectChangeHandler('workplacePlane', value)}
                                    >
                                        <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.workplacePlane ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Workplace Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Remote', 'On-site', 'Hybrid'].map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.workplacePlane && <p className="text-red-500 text-xs mt-1">{errors.workplacePlane}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="jobCategory" className="text-sm font-medium text-gray-700">Job Category</Label>
                                    <Select
                                        value={input.jobCategory}
                                        onValueChange={(value) => selectChangeHandler('jobCategory', value)}
                                    >
                                        <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.jobCategory ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Job Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Design', 'Product Management', 'Customer Support', 'IT', 'Operations', 'Other'].map((category) => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jobCategory && <p className="text-red-500 text-xs mt-1">{errors.jobCategory}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="datetime-local"
                                        name="availabilityFrame.startDate"
                                        value={input.availabilityFrame.startDate}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['availabilityFrame.startDate'] ? 'border-red-500' : ''}`}
                                    />
                                    {errors['availabilityFrame.startDate'] && <p className="text-red-500 text-xs mt-1">{errors['availabilityFrame.startDate']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date (optional)</Label>
                                    <Input
                                        id="endDate"
                                        type="datetime-local"
                                        name="availabilityFrame.endDate"
                                        value={input.availabilityFrame.endDate}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                                    <Select
                                        value={input.status}
                                        onValueChange={(value) => selectChangeHandler('status', value)}
                                    >
                                        <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Open', 'Closed', 'Draft', 'Expired'].map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="postedDate" className="text-sm font-medium text-gray-700">Posted Date</Label>
                                    <Input
                                        id="postedDate"
                                        type="text"
                                        value={input.postedDate}
                                        disabled
                                        className="mt-1 border-gray-300 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="datetime-local"
                                        name="deadline"
                                        value={input.deadline}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.deadline ? 'border-red-500' : ''}`}
                                    />
                                    {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vacancies" className="text-sm font-medium text-gray-700">Vacancies</Label>
                                    <Input
                                        id="vacancies"
                                        type="number"
                                        name="vacancies"
                                        value={input.vacancies}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.vacancies ? 'border-red-500' : ''}`}
                                        placeholder="e.g., 5"
                                    />
                                    {errors.vacancies && <p className="text-red-500 text-xs mt-1">{errors.vacancies}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="benefits" className="text-sm font-medium text-gray-700">Benefits (comma-separated)</Label>
                                    <Input
                                        id="benefits"
                                        type="text"
                                        name="benefits"
                                        value={input.benefits}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., Health Insurance, Paid Leave"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="educationLevel" className="text-sm font-medium text-gray-700">Education Level</Label>
                                    <Select
                                        value={input.educationLevel}
                                        onValueChange={(value) => selectChangeHandler('educationLevel', value)}
                                    >
                                        <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                            <SelectValue placeholder="Select Education Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['High School', 'Bachelor', 'Master', 'PhD', 'Other'].map((level) => (
                                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">Keywords (comma-separated)</Label>
                                    <Input
                                        id="keywords"
                                        type="text"
                                        name="keywords"
                                        value={input.keywords}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., coding, teamwork"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    'Update Job'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default JobSetup;