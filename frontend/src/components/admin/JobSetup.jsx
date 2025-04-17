import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Check, ChevronsUpDown, Edit, AlertCircle, X as XIcon, Plus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetJobById from '@/hooks/useGetJobById';
import { cn } from '@/lib/utils';
import { SelectGroup } from '@radix-ui/react-select';

// Predefined common benefits
const commonBenefits = [
  "Health Insurance",
  "Provident Fund",
  "Cell Phone Insurance",
  "Paid Sick Time",
  "Work From Home",
  "Food Provided",
  "Life Insurance",
  "Internet Reimbursement",
  "Commuter Assistance"
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Sample job titles array
const jobTitles = [
  "HR Executive",
  "HR Manager",
  "HR Director",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Office Assistant",
  "Office Manager",
  "Office Boy",
  "Financial Analyst",
  "Financial Manager",
  "Accountant",
  "Financial Advisor",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "Software Engineer",
  "QA Engineer",
  "Project Manager"
];

// Sample job categories
const jobCategories = [
  "Engineering",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Design",
  "Product Management",
  "Customer Support",
  "IT",
  "Operations",
  "Other"
];

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Freelancing"
];

const workplaceTypes = [
  "Remote",
  "On-site",
  "Hybrid"
];

const JobSetup = () => {
  const params = useParams();
  useGetJobById(params.id);
  const { singleJob } = useSelector((store) => store.job);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    jobTitle: '',
    jobDescription: '',
    workLocation: {
      city: '',
      state: '',
      pincode: '',
      area: '',
      streetAddress: '',
      country: 'India' // Added default country field
    },
    jobType: '',
    experienceLevel: '',
    companyId: '',
    companyName: '',
    workplacePlane: '',
    jobCategory: '',
    skills: '',
    salaryRange: '',
    numberOfPositions: '',
    status: '',
  });

  const [benefitBadges, setBenefitBadges] = useState([]);
  const [showCustomBenefitInput, setShowCustomBenefitInput] = useState(false);
  const [customBenefitInput, setCustomBenefitInput] = useState('');

  const [errors, setErrors] = useState({});
  const [isCustomTitle, setIsCustomTitle] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [jobTitleOpen, setJobTitleOpen] = useState(false);
  const [jobCategoryOpen, setJobCategoryOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [fetchingAreas, setFetchingAreas] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const { companies } = useSelector((store) => store.company);

 // console.log(companies,"check1");
  

  const validateInput = () => {
    const newErrors = {};

    // Basic validation for required fields
    if (!input.jobTitle || input.jobTitle.trim().length < 3) {
      newErrors.jobTitle = 'Job title is required (min 3 chars).';
    }

    if (!input.jobDescription || input.jobDescription.trim().length < 10) {
      newErrors.jobDescription = 'Description is required (min 10 chars).';
    }

    // Work location validation
    if (!input.workLocation.city) {
      newErrors['workLocation.city'] = 'City is required.';
    }

    if (!input.workLocation.state) {
      newErrors['workLocation.state'] = 'State is required.';
    }

    if (!input.workLocation.pincode || !/^\d{6}$/.test(input.workLocation.pincode)) {
      newErrors['workLocation.pincode'] = 'Pincode must be a 6-digit number.';
    }

    if (!input.workLocation.area) {
      newErrors['workLocation.area'] = 'Area is required.';
    }

    if (!input.workLocation.streetAddress) {
      newErrors['workLocation.streetAddress'] = 'Street address is required.';
    }

    // Job details validation
    if (!input.jobType) {
      newErrors.jobType = 'Job type is required.';
    }

    if (!input.experienceLevel) {
      newErrors.experienceLevel = 'Experience level is required.';
    } else if (!/^\d+(\.\d+)?$/.test(input.experienceLevel) || Number(input.experienceLevel) < 0) {
      newErrors.experienceLevel = 'Experience level must be a positive number.';
    }

    // Company details validation
    if (!input.companyName) {
      newErrors.companyName = 'Company name is required.';
    }

    // Additional job information validation
    if (!input.workplacePlane) {
      newErrors.workplacePlane = 'Workplace type is required.';
    }

    if (!input.jobCategory) {
      newErrors.jobCategory = 'Job category is required.';
    }

    // Skills validation
    if (!input.skills || input.skills.trim() === '') {
      newErrors.skills = 'At least one skill is required.';
    } else {
      const skillsArray = input.skills.split(',').map(skill => skill.trim()).filter(Boolean);
      if (skillsArray.length === 0) {
        newErrors.skills = 'At least one valid skill is required.';
      }
    }

    // Numerical fields validation
    if (!input.numberOfPositions) {
      newErrors.numberOfPositions = 'Number of positions is required.';
    } else if (!/^\d+$/.test(input.numberOfPositions) || Number(input.numberOfPositions) < 1) {
      newErrors.numberOfPositions = 'Number of positions must be a positive number.';
    }

    // Salary range validation (optional field)
    if (input.salaryRange) {
      const salaryParts = input.salaryRange.split(/[,|-]/);
      if (salaryParts.length !== 2) {
        newErrors.salaryRange = 'Salary range format should be min-max or min,max';
      } else {
        const [minSalary, maxSalary] = salaryParts.map(part => part.trim());
        if (!/^\d+$/.test(minSalary)) {
          newErrors.salaryRange = 'Minimum salary must be a number.';
        }
        if (!/^\d+$/.test(maxSalary)) {
          newErrors.salaryRange = 'Maximum salary must be a number.';
        }
        if (Number(minSalary) >= Number(maxSalary)) {
          newErrors.salaryRange = 'Maximum salary must be greater than minimum salary.';
        }
      }
    }

    // Status validation
    // if (!input.status) newErrors.status = 'Status is required.';

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
    // Clear error when field is changed
    if (name.includes('.')) {
      setErrors({ ...errors, [name]: '' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const selectChangeHandler = (name, value) => {
    setInput(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: { ...prev[parent], [child]: value },
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };
  

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setInput({
      ...input,
      workLocation: { ...input.workLocation, pincode },
    });
    setErrors({ ...errors, 'workLocation.pincode': '' });
    setPincodeError('');

    if (/^\d{6}$/.test(pincode)) {
      try {
        setFetchingAreas(true);
        const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        if (res.data[0].Status === 'Success' && res.data[0].PostOffice) {
          const { District, State } = res.data[0].PostOffice[0];
          setInput((prev) => ({
            ...prev,
            workLocation: {
              ...prev.workLocation,
              city: District,
              state: State,
              country: 'India', // Ensure country is set
            },
          }));

          // Set available areas from PostOffice data
          const areas = res.data[0].PostOffice.map(po => po.Name);
          setAvailableAreas(areas);

          setErrors({
            ...errors,
            'workLocation.city': '',
            'workLocation.state': '',
          });
        } else {
          setPincodeError('Invalid pincode. Please check and try again.');
          setAvailableAreas([]);
        }
      } catch (error) {
        setPincodeError('Failed to fetch pincode details. Please enter location manually.');
        setAvailableAreas([]);
      } finally {
        setFetchingAreas(false);
      }
    } else if (pincode !== '') {
      setPincodeError('Pincode must be a 6-digit number.');
      setAvailableAreas([]);
    }
  };

  const toggleBenefit = (benefit) => {
    if (benefitBadges.includes(benefit)) {
      setBenefitBadges(benefitBadges.filter(b => b !== benefit));
    } else {
      setBenefitBadges([...benefitBadges, benefit]);
    }
  };

  const handleAddCustomBenefit = () => {
    if (customBenefitInput.trim()) {
      const newBenefit = customBenefitInput.trim();
      if (!benefitBadges.includes(newBenefit)) {
        setBenefitBadges([...benefitBadges, newBenefit]);
      }
      setCustomBenefitInput('');
      setShowCustomBenefitInput(false);
    }
  };

  const handleCustomBenefitKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomBenefit();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInput()) {
      toast.error('Please fix the errors in the form.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const updatedFields = {
      jobTitle: input.jobTitle.trim(),
      jobDescription: input.jobDescription.trim(),
      workLocation: {
        city: input.workLocation.city,
        state: input.workLocation.state,
        pincode: input.workLocation.pincode,
        area: input.workLocation.area,
        streetAddress: input.workLocation.streetAddress,
        country: input.workLocation.country || 'India',
      },
      jobType: input.jobType,
      experienceLevel: Number(input.experienceLevel),
      companyId: input.companyId,
      companyName: input.companyName,
      workplacePlane: input.workplacePlane,
      jobCategory: input.jobCategory,
      // Process skills as array - match backend expectations
      skills: input.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      // Pass benefits directly as array - match backend expectations
      benefits: benefitBadges,
      // Format salary range properly
      salaryRange: input.salaryRange
        ? {
            minSalary: Number(input.salaryRange.split(/[,|-]/)[0].trim()),
            maxSalary: Number(input.salaryRange.split(/[,|-]/)[1].trim()),
            currency: 'INR', // Default
            frequency: 'yearly' // Default
          }
        : null,
      numberOfPositions: Number(input.numberOfPositions),
      status: input.status,
    };

    // Remove undefined or empty fields
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] === undefined ||
         (Array.isArray(updatedFields[key]) && updatedFields[key].length === 0) ||
         updatedFields[key] === null) {
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

      // Process backend validation errors and set them in the UI
      if (errorDetails.length > 0) {
        const newErrors = {};
        errorDetails.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // This useEffect will run whenever singleJob changes
  useEffect(() => {
   
      console.log("Setting job data from API:", singleJob);
  
      // Find company in companies array
      const company = companies.find(
        (c) => c._id === singleJob.companyId || c.name === singleJob.companyName
      );

      // console.log(company,"this is company");
      
  
      // Update input state using functional update
      setInput((prev) => ({
        ...prev,
        jobTitle: singleJob.jobTitle || '',
        jobDescription: singleJob.jobDescription || '',
        workLocation: {
          city: singleJob.workLocation?.city || '',
          state: singleJob.workLocation?.state || '',
          pincode: singleJob.workLocation?.pincode || '',
          area: singleJob.workLocation?.area || '',
          streetAddress: singleJob.workLocation?.streetAddress || '',
          country: singleJob.workLocation?.country || 'India',
        },
        jobType: singleJob.jobType || '',
        experienceLevel: String(singleJob.experienceLevel || ''),
        companyId: company?._id || singleJob.companyId || '',
        companyName: company?.name || singleJob.companyName || '',
        workplacePlane: singleJob.workplacePlane || '',
        jobCategory: singleJob.jobCategory || '',
        skills: Array.isArray(singleJob.skills) ? singleJob.skills.join(', ') : singleJob.skills || '',
        salaryRange: singleJob.salaryRange
          ? `${singleJob.salaryRange.minSalary || ''}-${singleJob.salaryRange.maxSalary || ''}`
          : '',
        numberOfPositions: String(singleJob.numberOfPositions || ''),
        // status: singleJob.status || '',
      }));
  
      // Set benefits array
      if (Array.isArray(singleJob.benefits)) {
        setBenefitBadges(singleJob.benefits);
      } else {
        setBenefitBadges([]);
      }
    
  }, [singleJob, companies, setBenefitBadges]);

  console.log(input,"check")

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-20"></div>
          <CardHeader className="relative pt-6 pb-4 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-800">Edit Job</CardTitle>
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
                  <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title <span className="text-red-500">*</span></Label>
                  {isCustomTitle ? (
                    <div className="flex mt-2">
                      <Input
                        id="jobTitle"
                        type="text"
                        name="jobTitle"
                        value={input.jobTitle}
                        onChange={changeEventHandler}
                        className={`flex-1 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-l-xl shadow-sm transition-all duration-200 ${errors.jobTitle ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter custom job title"
                      />
                      <Button
                        type="button"
                        onClick={() => setIsCustomTitle(false)}
                        className="rounded-r-xl border border-l-0 border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600"
                      >
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Popover open={jobTitleOpen} onOpenChange={setJobTitleOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={jobTitleOpen}
                          className={`w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal ${errors.jobTitle ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                          {input.jobTitle || "Select job title..."}
                          <div className="flex items-center">
                            <Edit
                              className="h-4 w-4 mr-2 cursor-pointer text-gray-500 hover:text-indigo-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCustomTitle(true);
                              }}
                            />
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search job title..." />
                          <CommandEmpty>No job title found. Click the edit icon to enter a custom title.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {jobTitles.map((title) => (
                              <CommandItem
                                key={title}
                                value={title}
                                onSelect={() => {
                                  setInput({ ...input, jobTitle: title });
                                  setErrors({ ...errors, jobTitle: '' });
                                  setJobTitleOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    input.jobTitle === title ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                </div>

                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company <span className="text-red-500">*</span></Label>
                  <Select
                    value={input.companyName}
                    onValueChange={(value) => {
                      selectChangeHandler('companyName', value);
                      // Also set companyId if needed
                      const selectedCompany = companies.find(c => c.name === value);
                      if (selectedCompany) {
                        selectChangeHandler('companyId', selectedCompany._id);
                      }
                    }}
                  >
                    <SelectTrigger className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm ${errors.companyName ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select a Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company.name}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">Job Description <span className="text-red-500">*</span></Label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={input.jobDescription}
                    onChange={changeEventHandler}
                    rows={4}
                    className={`mt-2 w-full border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 ${errors.jobDescription ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., Develop and maintain web applications..."
                  />
                  {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription}</p>}
                </div>

                <div>
                  <Label htmlFor="skills" className="text-sm font-medium text-gray-700">Skills (comma-separated) <span className="text-red-500">*</span></Label>
                  <Input
                    id="skills"
                    type="text"
                    name="skills"
                    value={input.skills}
                    onChange={changeEventHandler}
                    className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 ${errors.skills ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
                </div>

                <div>
                  <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">Job Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={input.jobType}
                    onValueChange={(value) => selectChangeHandler('jobType', value)}
                  >
                    <SelectTrigger className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm ${errors.jobType ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select job type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>}
                </div>

                <div>
                  <Label htmlFor="workLocation.pincode" className="text-sm font-medium text-gray-700">Pincode <span className="text-red-500">*</span></Label>
                  <div className="mt-2 relative">
                    <Input
                      id="workLocation.pincode"
                      type="text"
                      name="workLocation.pincode"
                      value={input.workLocation.pincode}
                      onChange={handlePincodeChange}
                      className={cn(
                        "h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                        (errors['workLocation.pincode'] || pincodeError) && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                      placeholder="e.g., 400001"
                    />
                    {fetchingAreas && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </div>
                  {(errors['workLocation.pincode'] || pincodeError) && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors['workLocation.pincode'] || pincodeError}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="workLocation.area" className="text-sm font-medium text-gray-700">Area <span className="text-red-500">*</span></Label>
                  <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={areaOpen}
                        disabled={fetchingAreas || availableAreas.length === 0}
                        className="w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600                       focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal"
                      >
                        {input.workLocation.area || "Select area..."}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search area..." />
                        <CommandEmpty>No area found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {availableAreas.map((area) => (
                            <CommandItem
                              key={area}
                              value={area}
                              onSelect={() => {
                                setInput({
                                  ...input,
                                  workLocation: { ...input.workLocation, area },
                                });
                                setErrors({ ...errors, 'workLocation.area': '' });
                                setAreaOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  input.workLocation.area === area ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {area}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors['workLocation.area'] && <p className="text-red-500 text-xs mt-1">{errors['workLocation.area']}</p>}
                </div>

                <div>
                  <Label htmlFor="workLocation.city" className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></Label>
                  <Input
                    id="workLocation.city"
                    type="text"
                    name="workLocation.city"
                    value={input.workLocation.city}
                    onChange={changeEventHandler}
                    className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 ${errors['workLocation.city'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., Mumbai"
                  />
                  {errors['workLocation.city'] && <p className="text-red-500 text-xs mt-1">{errors['workLocation.city']}</p>}
                </div>

                <div>
                  <Label htmlFor="workLocation.state" className="text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></Label>
                  <Popover open={stateOpen} onOpenChange={setStateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={stateOpen}
                        className="w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal"
                      >
                        {input.workLocation.state || "Select state..."}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {indianStates.map((state) => (
                            <CommandItem
                              key={state}
                              value={state}
                              onSelect={() => {
                                setInput({
                                  ...input,
                                  workLocation: { ...input.workLocation, state },
                                });
                                setErrors({ ...errors, 'workLocation.state': '' });
                                setStateOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  input.workLocation.state === state ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {state}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors['workLocation.state'] && <p className="text-red-500 text-xs mt-1">{errors['workLocation.state']}</p>}
                </div>

                <div>
                  <Label htmlFor="workLocation.streetAddress" className="text-sm font-medium text-gray-700">Street Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="workLocation.streetAddress"
                    type="text"
                    name="workLocation.streetAddress"
                    value={input.workLocation.streetAddress}
                    onChange={changeEventHandler}
                    className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 ${errors['workLocation.streetAddress'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., 123 Main St"
                  />
                  {errors['workLocation.streetAddress'] && <p className="text-red-500 text-xs mt-1">{errors['workLocation.streetAddress']}</p>}
                </div>

                <div>
                  <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">Experience Level <span className="text-red-500">*</span></Label>
                  <Input
                    id="experienceLevel"
                    type="number"
                    name="experienceLevel"
                    value={input.experienceLevel}
                    onChange={changeEventHandler}
                    className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 ${errors.experienceLevel ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., 2"
                  />
                  {errors.experienceLevel && <p className="text-red-500 text-xs mt-1">{errors.experienceLevel}</p>}
                </div>

                <div>
                  <Label htmlFor="workplacePlane" className="text-sm font-medium text-gray-700">Workplace Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={input.workplacePlane}
                    onValueChange={(value) => selectChangeHandler('workplacePlane', value)}
                  >
                    <SelectTrigger className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm ${errors.workplacePlane ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select workplace type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {workplaceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.workplacePlane && <p className="text-red-500 text-xs mt-1">{errors.workplacePlane}</p>}
                </div>

                <div>
                  <Label htmlFor="jobCategory" className="text-sm font-medium text-gray-700">Job Category <span className="text-red-500">*</span></Label>
                  {isCustomCategory ? (
                    <div className="flex mt-2">
                      <Input
                        id="jobCategory"
                        type="text"
                        name="jobCategory"
                        value={input.jobCategory}
                        onChange={changeEventHandler}
                        className={`flex-1 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-l-xl shadow-sm transition-all duration-200 ${errors.jobCategory ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter custom job category"
                      />
                      <Button
                        type="button"
                        onClick={() => setIsCustomCategory(false)}
                        className="rounded-r-xl border border-l-0 border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600"
                      >
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Popover open={jobCategoryOpen} onOpenChange={setJobCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={jobCategoryOpen}
                          className={`w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal ${errors.jobCategory ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                          {input.jobCategory || "Select job category..."}
                          <div className="flex items-center">
                            <Edit
                              className="h-4 w-4 mr-2 cursor-pointer text-gray-500 hover:text-indigo-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCustomCategory(true);
                              }}
                            />
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search job category..." />
                          <CommandEmpty>No job category found. Click the edit icon to enter a custom category.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {jobCategories.map((category) => (
                              <CommandItem
                                key={category}
                                value={category}
                                onSelect={() => {
                                  setInput({ ...input, jobCategory: category });
                                  setErrors({ ...errors, jobCategory: '' });
                                  setJobCategoryOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    input.jobCategory === category ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {category}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  {errors.jobCategory && <p className="text-red-500 text-xs mt-1">{errors.jobCategory}</p>}
                </div>

                <div>
                  <Label htmlFor="salaryRange" className="text-sm font-medium text-gray-700">Salary Range</Label>
                  <Input
                    id="salaryRange"
                    type="text"
                    name="salaryRange"
                    value={input.salaryRange}
                    onChange={changeEventHandler}
                    className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 ${errors.salaryRange ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., 50000-70000"
                  />
                  {errors.salaryRange && <p className="text-red-500 text-xs mt-1">{errors.salaryRange}</p>}
                </div>

                <div>
                  <Label htmlFor="numberOfPositions" className="text-sm font-medium text-gray-700">Number of Positions <span className="text-red-500">*</span></Label>
                  <Input
                    id="numberOfPositions"
                    type="number"
                    name="numberOfPositions"
                    value={input.numberOfPositions}
                    onChange={changeEventHandler}
                    className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 ${errors.numberOfPositions ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., 1"
                  />
                  {errors.numberOfPositions && <p className="text-red-500 text-xs mt-1">{errors.numberOfPositions}</p>}
                </div>
{/* 
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={input.status}
                    onValueChange={(value) => selectChangeHandler('status', value)}
                  >
                    <SelectTrigger className={`mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm ${errors.status ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                </div> */}

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Benefits</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {commonBenefits.map((benefit) => (
                      <Badge
                        key={benefit}
                        className={`cursor-pointer ${benefitBadges.includes(benefit) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => toggleBenefit(benefit)}
                      >
                        {benefit}
                      </Badge>
                    ))}
                    {showCustomBenefitInput ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={customBenefitInput}
                          onChange={(e) => setCustomBenefitInput(e.target.value)}
                          onKeyDown={handleCustomBenefitKeyDown}
                          className="h-10 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm"
                          placeholder="Add custom benefit"
                        />
                        <Button
                          type="button"
                          onClick={handleAddCustomBenefit}
                          className="h-10 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setShowCustomBenefitInput(false)}
                          className="h-10 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setShowCustomBenefitInput(true)}
                        className="h-10 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Custom Benefit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobSetup;
