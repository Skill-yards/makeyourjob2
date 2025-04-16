import { useEffect, useState } from 'react';
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
        jobTitle: '',
        jobDescription: '',
        salaryRange: { minSalary: '', maxSalary: '', currency: 'INR', frequency: 'yearly' },
        experienceLevel: '',
        workLocation: { city: '', state: '', area: '', streetAddress: '', pincode: '' },
        jobType: '',
        numberOfPositions: '',
        companyName: '',
        workplacePlane: '',
        jobCategory: '',
        skills: '',
        status: '',
        deadline: '',
    });

    const [errors, setErrors] = useState({});

    const validateInput = () => {
        const newErrors = {};

        if (!input.jobTitle || input.jobTitle.length < 3) newErrors.jobTitle = 'Job title is required (min 3 chars).';
        if (!input.jobDescription || input.jobDescription.length < 10) newErrors.jobDescription = 'Description is required (min 10 chars).';
        if (!input.companyName) newErrors.companyName = 'Company name is required.';
        if (!input.salaryRange.minSalary || !/^\d+$/.test(input.salaryRange.minSalary)) newErrors['salaryRange.minSalary'] = 'Min salary must be a number.';
        if (!input.salaryRange.maxSalary || !/^\d+$/.test(input.salaryRange.maxSalary)) newErrors['salaryRange.maxSalary'] = 'Max salary must be a number.';
        if (input.salaryRange.minSalary && input.salaryRange.maxSalary && Number(input.salaryRange.minSalary) >= Number(input.salaryRange.maxSalary)) {
            newErrors['salaryRange.maxSalary'] = 'Max salary must be greater than min.';
        }
        if (!input.salaryRange.currency) newErrors['salaryRange.currency'] = 'Currency is required.';
        if (!input.salaryRange.frequency) newErrors['salaryRange.frequency'] = 'Frequency is required.';
        if (!input.experienceLevel) newErrors.experienceLevel = 'Experience level is required.';
        if (!input.workLocation.city) newErrors['workLocation.city'] = 'City is required.';
        if (!input.workLocation.state) newErrors['workLocation.state'] = 'State is required.';
        if (!input.jobType) newErrors.jobType = 'Job type is required.';
        if (!input.numberOfPositions || !/^\d+$/.test(input.numberOfPositions) || Number(input.numberOfPositions) < 1) {
            newErrors.numberOfPositions = 'Number of positions must be a positive number.';
        }
        if (!input.workplacePlane) newErrors.workplacePlane = 'Workplace type is required.';
        if (!input.jobCategory) newErrors.jobCategory = 'Job category is required.';
        if (!input.skills) newErrors.skills = 'At least one skill is required.';
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
        setErrors({ ...errors, [name]: '' });
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
        setErrors({ ...errors, [name]: '' });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateInput()) {
            toast.error('Please fix the errors in the form.');
            return;
        }

        const updatedFields = {
            jobTitle: input.jobTitle,
            jobDescription: input.jobDescription,
            salaryRange: {
                minSalary: input.salaryRange.minSalary,
                maxSalary: input.salaryRange.maxSalary,
                currency: input.salaryRange.currency,
                frequency: input.salaryRange.frequency,
            },
            experienceLevel: input.experienceLevel,
            workLocation: {
                city: input.workLocation.city,
                state: input.workLocation.state,
                area: input.workLocation.area,
                streetAddress: input.workLocation.streetAddress,
                pincode: input.workLocation.pincode,
            },
            jobType: input.jobType,
            numberOfPositions: input.numberOfPositions,
            companyName: input.companyName,
            workplacePlane: input.workplacePlane,
            jobCategory: input.jobCategory,
            skills: input.skills.split(',').map((s) => s.trim()).filter((s) => s),
            status: input.status,
            deadline: input.deadline || undefined,
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
                jobTitle: singleJob.jobTitle || '',
                jobDescription: singleJob.jobDescription || '',
                salaryRange: {
                    minSalary: singleJob.salaryRange?.minSalary?.toString() || '',
                    maxSalary: singleJob.salaryRange?.maxSalary?.toString() || '',
                    currency: singleJob.salaryRange?.currency || 'INR',
                    frequency: singleJob.salaryRange?.frequency || 'yearly',
                },
                experienceLevel: singleJob.experienceLevel || '',
                workLocation: {
                    city: singleJob.workLocation?.city || '',
                    state: singleJob.workLocation?.state || '',
                    area: singleJob.workLocation?.area || '',
                    streetAddress: singleJob.workLocation?.streetAddress || '',
                    pincode: singleJob.workLocation?.pincode || '',
                },
                jobType: singleJob.jobType || '',
                numberOfPositions: singleJob.numberOfPositions?.toString() || '',
                companyName: singleJob.companyName || '',
                workplacePlane: singleJob.workplacePlane || '',
                jobCategory: singleJob.jobCategory || '',
                skills: singleJob.skills?.join(', ') || '',
                status: singleJob.status || '',
                deadline: formatDate(singleJob.deadline) || '',
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
                                    <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
                                    <Input
                                        id="jobTitle"
                                        type="text"
                                        name="jobTitle"
                                        value={input.jobTitle}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.jobTitle ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Software Engineer"
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
                                    <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">Description</Label>
                                    <Input
                                        id="jobDescription"
                                        type="text"
                                        name="jobDescription"
                                        value={input.jobDescription}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.jobDescription ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Develop and maintain web applications..."
                                    />
                                    {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription}</p>}
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
                                        placeholder="e.g., JavaScript, React, Node.js"
                                    />
                                    {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="minSalary" className="text-sm font-medium text-gray-700">Salary Min (₹ LPA)</Label>
                                    <Input
                                        id="minSalary"
                                        type="number"
                                        name="salaryRange.minSalary"
                                        value={input.salaryRange.minSalary}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['salaryRange.minSalary'] ? 'border-red-500' : ''}`}
                                        placeholder="e.g., 4"
                                    />
                                    {errors['salaryRange.minSalary'] && <p className="text-red-500 text-xs mt-1">{errors['salaryRange.minSalary']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="maxSalary" className="text-sm font-medium text-gray-700">Salary Max (₹ LPA)</Label>
                                    <Input
                                        id="maxSalary"
                                        type="number"
                                        name="salaryRange.maxSalary"
                                        value={input.salaryRange.maxSalary}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['salaryRange.maxSalary'] ? 'border-red-500' : ''}`}
                                        placeholder="e.g., 6"
                                    />
                                    {errors['salaryRange.maxSalary'] && <p className="text-red-500 text-xs mt-1">{errors['salaryRange.maxSalary']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                                    <Select
                                        value={input.salaryRange.currency}
                                        onValueChange={(value) => selectChangeHandler('salaryRange.currency', value)}
                                    >
                                        <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['salaryRange.currency'] ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['INR', 'USD', 'EUR', 'GBP'].map((currency) => (
                                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors['salaryRange.currency'] && <p className="text-red-500 text-xs mt-1">{errors['salaryRange.currency']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">Frequency</Label>
                                    <Select
                                        value={input.salaryRange.frequency}
                                        onValueChange={(value) => selectChangeHandler('salaryRange.frequency', value)}
                                    >
                                        <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['salaryRange.frequency'] ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['yearly', 'monthly', 'hourly'].map((freq) => (
                                                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors['salaryRange.frequency'] && <p className="text-red-500 text-xs mt-1">{errors['salaryRange.frequency']}</p>}
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
                                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        name="workLocation.city"
                                        value={input.workLocation.city}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['workLocation.city'] ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Mumbai"
                                    />
                                    {errors['workLocation.city'] && <p className="text-red-500 text-xs mt-1">{errors['workLocation.city']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                                    <Input
                                        id="state"
                                        type="text"
                                        name="workLocation.state"
                                        value={input.workLocation.state}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors['workLocation.state'] ? 'border-red-500' : ''}`}
                                        placeholder="e.g., Maharashtra"
                                    />
                                    {errors['workLocation.state'] && <p className="text-red-500 text-xs mt-1">{errors['workLocation.state']}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="area" className="text-sm font-medium text-gray-700">Area (optional)</Label>
                                    <Input
                                        id="area"
                                        type="text"
                                        name="workLocation.area"
                                        value={input.workLocation.area}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., Fort"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">Street Address (optional)</Label>
                                    <Input
                                        id="streetAddress"
                                        type="text"
                                        name="workLocation.streetAddress"
                                        value={input.workLocation.streetAddress}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., 123 Main St"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode (optional)</Label>
                                    <Input
                                        id="pincode"
                                        type="text"
                                        name="workLocation.pincode"
                                        value={input.workLocation.pincode}
                                        onChange={changeEventHandler}
                                        className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., 400001"
                                    />
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
                                    <Label htmlFor="numberOfPositions" className="text-sm font-medium text-gray-700">Number of Positions</Label>
                                    <Input
                                        id="numberOfPositions"
                                        type="number"
                                        name="numberOfPositions"
                                        value={input.numberOfPositions}
                                        onChange={changeEventHandler}
                                        className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.numberOfPositions ? 'border-red-500' : ''}`}
                                        placeholder="e.g., 2"
                                    />
                                    {errors.numberOfPositions && <p className="text-red-500 text-xs mt-1">{errors.numberOfPositions}</p>}
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
                                    <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">Deadline (optional)</Label>
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