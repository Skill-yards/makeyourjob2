import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Briefcase,
  MapPin,
  Check,
  ChevronsUpDown,
  Edit,
  AlertCircle,
  X as XIcon,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const PostJob = () => {
  const [input, setInput] = useState({
    jobTitle: '',
    jobDescription: '',
    workLocation: {
      city: '',
      state: '',
      pincode: '',
      area: '',
      streetAddress: ''
    },
    jobType: '',
    experienceLevel: '',
    companyId: '',
    companyName: '',
    workplacePlane: '',
    jobCategory: '',
    skills: '',
    benefits: '',
    salaryRange: '',
    numberOfPositions: '1',
  });

  const [benefitBadges, setBenefitBadges] = useState([]);
  const [showCustomBenefitInput, setShowCustomBenefitInput] = useState(false);
  const [customBenefitInput, setCustomBenefitInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [jobTitleOpen, setJobTitleOpen] = useState(false);
  const [jobCategoryOpen, setJobCategoryOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [isCustomTitle, setIsCustomTitle] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [fetchingAreas, setFetchingAreas] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  useEffect(() => {
    setInput({
      ...input,
      benefits: benefitBadges.join(', ')
    });
  }, [benefitBadges]);

  useEffect(() => {
    if (input.benefits && !benefitBadges.length) {
      const initialBenefits = input.benefits
        .split(',')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit !== '');
      setBenefitBadges(initialBenefits);
    }
  }, []);

  const fetchPincodeDetails = async (pincode) => {
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      setAvailableAreas([]);
      return;
    }

    try {
      setFetchingAreas(true);
      setPincodeError('');
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data && response.data[0]) {
        const result = response.data[0];
        if (result.Status === 'Success') {
          const areas = result.PostOffice.map(office => office.Name);
          if (areas.length > 0 && result.PostOffice[0]) {
            const firstOffice = result.PostOffice[0];
            setInput(prev => ({
              ...prev,
              workLocation: {
                ...prev.workLocation,
                city: firstOffice.District || '',
                state: firstOffice.State || '',
              }
            }));
          }
          setAvailableAreas(areas);
        } else {
          setPincodeError('No locations found for this pincode');
          setAvailableAreas([]);
        }
      } else {
        setPincodeError('Failed to fetch location details');
        setAvailableAreas([]);
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
      setPincodeError('Error fetching(Sender) fetching location details. Please try again.');
      setAvailableAreas([]);
    } finally {
      setFetchingAreas(false);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFetchPincodeDetails = React.useCallback(
    debounce(fetchPincodeDetails, 800),
    []
  );

  useEffect(() => {
    const pincode = input.workLocation.pincode;
    if (pincode && pincode.length === 6) {
      debouncedFetchPincodeDetails(pincode);
    } else if (pincode && pincode.length > 0 && pincode.length < 6) {
      setPincodeError('');
      setAvailableAreas([]);
    }
  }, [input.workLocation.pincode]);

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
    // Clear validation error for this field
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleBenefit = (benefit) => {
    if (benefitBadges.includes(benefit)) {
      setBenefitBadges(benefitBadges.filter(b => b !== benefit));
    } else {
      setBenefitBadges([...benefitBadges, benefit]);
    }
    setValidationErrors(prev => ({ ...prev, benefits: '' }));
  };

  const handleAddCustomBenefit = () => {
    if (customBenefitInput.trim()) {
      const newBenefit = customBenefitInput.trim();
      if (!benefitBadges.includes(newBenefit)) {
        setBenefitBadges([...benefitBadges, newBenefit]);
      }
      setCustomBenefitInput('');
      setShowCustomBenefitInput(false);
      setValidationErrors(prev => ({ ...prev, benefits: '' }));
    }
  };

  const handleCustomBenefitKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomBenefit();
    }
  };

  const selectChangeHandler = (name, value) => {
    if (name === 'companyId') {
      const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
      if (selectedCompany) {
        setInput({ ...input, companyId: selectedCompany._id, companyName: selectedCompany.name });
      }
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInput({
        ...input,
        [parent]: { ...input[parent], [child]: value },
      });
    } else {
      setInput({ ...input, [name]: value });
    }
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value.trim();
    if (pincode === '' || (/^\d*$/.test(pincode) && pincode.length <= 6)) {
      setInput({
        ...input,
        workLocation: {
          ...input.workLocation,
          pincode: pincode,
          area: ''
        },
      });
      setValidationErrors(prev => ({ ...prev, 'workLocation.pincode': '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      { field: 'jobTitle', message: 'Job title is required' },
      { field: 'jobDescription', message: 'Job description is required' },
      { field: 'workLocation.city', message: 'City is required' },
      { field: 'workLocation.state', message: 'State is required' },
      { field: 'workLocation.pincode', message: 'Pincode is required' },
      { field: 'workLocation.area', message: 'Area is required' },
      { field: 'workLocation.streetAddress', message: 'Street address is required' },
      { field: 'jobType', message: 'Job type is required' },
      { field: 'experienceLevel', message: 'Experience level is required' },
      { field: 'companyId', message: 'Company is required' },
      { field: 'workplacePlane', message: 'Workplace plane is required' },
      { field: 'jobCategory', message: 'Job category is required' },
      { field: 'skills', message: 'At least one skill is required' },
      { field: 'numberOfPositions', message: 'Number of positions is required' },
    ];

    requiredFields.forEach(({ field, message }) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!input[parent][child]?.trim()) {
          errors[field] = message;
        }
      } else if (!input[field]?.trim()) {
        errors[field] = message;
      }
    });

    // Validate pincode format
    if (input.workLocation.pincode && !/^\d{6}$/.test(input.workLocation.pincode)) {
      errors['workLocation.pincode'] = 'Pincode must be 6 digits';
    }

    // Validate experience level
    if (input.experienceLevel) {
      const experience = parseFloat(input.experienceLevel);
      if (isNaN(experience) || experience < 0) {
        errors.experienceLevel = 'Experience level must be a non-negative number';
      }
    }

    // Validate number of positions
    if (input.numberOfPositions) {
      const positions = parseInt(input.numberOfPositions);
      if (isNaN(positions) || positions < 1) {
        errors.numberOfPositions = 'Number of positions must be at least 1';
      }
    }

    // Validate salary range format
    if (input.salaryRange) {
      const salaryParts = input.salaryRange.split(/[,|-]/).map(part => part.trim());
      if (salaryParts.length !== 2) {
        errors.salaryRange = 'Salary range must be in format: min-max or min,max';
      } else {
        const [min, max] = salaryParts.map(val => parseFloat(val));
        if (isNaN(min) || isNaN(max)) {
          errors.salaryRange = 'Salary range must contain valid numbers';
        } else if (min < 0 || max < 0) {
          errors.salaryRange = 'Salary values cannot be negative';
        } else if (min > max) {
          errors.salaryRange = 'Minimum salary cannot be greater than maximum';
        }
      }
    }

    // Validate skills format
    if (input.skills) {
      const skillsArray = input.skills.split(',').map(skill => skill.trim()).filter(Boolean);
      if (skillsArray.length === 0) {
        errors.skills = 'At least one skill is required';
      }
    }

    // Validate benefits
    if (benefitBadges.length === 0) {
      errors.benefits = 'At least one benefit is required';
    }

    return errors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    // Prepare payload
    const formattedSkills = input.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    const formattedBenefits = benefitBadges.filter(Boolean);
    let formattedSalaryRange = { minSalary: null, maxSalary: null };

    if (input.salaryRange) {
      const [min, max] = input.salaryRange.split(/[,|-]/).map(part => parseFloat(part.trim()));
      formattedSalaryRange = { minSalary: min, maxSalary: max };
    }

    const payload = {
      ...input,
      skills: formattedSkills,
      benefits: formattedBenefits,
      salaryRange: formattedSalaryRange,
      numberOfPositions: parseInt(input.numberOfPositions),
      experienceLevel: parseFloat(input.experienceLevel).toString()
    };

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Navbar />
      <div className="mx-auto py-12 px-2 sm:px-2 lg:px-2">
        <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-indigo-100 transition-all duration-300 hover:shadow-3xl">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-24"></div>
          <CardHeader className="relative pt-8 pb-4 px-8">
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              Post a New Job
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={submitHandler} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-800">Job Title</Label>
                  {isCustomTitle ? (
                    <div className="flex mt-2">
                      <Input
                        id="jobTitle"
                        type="text"
                        name="jobTitle"
                        value={input.jobTitle}
                        onChange={changeEventHandler}
                        className={cn(
                          "flex-1 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-l-xl shadow-sm transition-all duration-200",
                          validationErrors.jobTitle && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
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
                          className={cn(
                            "w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal",
                            validationErrors.jobTitle && "border-red-500 focus:border-red-500 focus:ring-red-500"
                          )}
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
                                  setJobTitleOpen(false);
                                  setValidationErrors(prev => ({ ...prev, jobTitle: '' }));
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
                  {validationErrors.jobTitle && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.jobTitle}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="jobDescription" className="text-sm font-semibold text-gray-800">Job Description</Label>
                  <Input
                    id="jobDescription"
                    type="text"
                    name="jobDescription"
                    value={input.jobDescription}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors.jobDescription && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., Develop and maintain web applications..."
                  />
                  {validationErrors.jobDescription && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.jobDescription}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="skills" className="text-sm font-semibold text-gray-800">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    type="text"
                    name="skills"
                    value={input.skills}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors.skills && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  {validationErrors.skills && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.skills}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="benefits" className="text-sm font-semibold text-gray-800">Benefits</Label>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {commonBenefits.map((benefit) => (
                        <Badge
                          key={benefit}
                          className={cn(
                            "cursor-pointer px-3 py-1.5 text-sm",
                            benefitBadges.includes(benefit)
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                            validationErrors.benefits && "border border-red-500"
                          )}
                          onClick={() => toggleBenefit(benefit)}
                        >
                          {benefit}
                          {benefitBadges.includes(benefit) && (
                            <Check className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                      <Badge
                        className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 text-sm flex items-center gap-1"
                        onClick={() => setShowCustomBenefitInput(true)}
                      >
                        <Plus className="h-3 w-3" />
                        Other
                      </Badge>
                    </div>

                    {benefitBadges.filter(b => !commonBenefits.includes(b)).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {benefitBadges.filter(b => !commonBenefits.includes(b)).map((benefit, index) => (
                          <Badge
                            key={`custom-${index}`}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 text-sm flex items-center gap-1"
                          >
                            {benefit}
                            <button
                              type="button"
                              onClick={() => setBenefitBadges(benefitBadges.filter(b => b !== benefit))}
                              className="ml-1 rounded-full focus:outline-none"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {showCustomBenefitInput && (
                      <div className="flex mt-2">
                        <Input
                          type="text"
                          value={customBenefitInput}
                          onChange={(e) => setCustomBenefitInput(e.target.value)}
                          onKeyDown={handleCustomBenefitKeyDown}
                          placeholder="Type custom benefit..."
                          className="flex-1 h-10 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-l-lg shadow-sm transition-all duration-200"
                        />
                        <Button
                          type="button"
                          onClick={handleAddCustomBenefit}
                          className="rounded-r-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setShowCustomBenefitInput(false);
                            setCustomBenefitInput('');
                          }}
                          variant="ghost"
                          className="ml-2 px-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100"
                        >
                          <XIcon className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    )}
                    {validationErrors.benefits && (
                      <div className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.benefits}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyId" className="text-sm font-semibold text-gray-800">Company</Label>
                  <Select onValueChange={(value) => selectChangeHandler('companyId', value)}>
                    <SelectTrigger className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm",
                      validationErrors.companyId && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}>
                      <SelectValue placeholder="Select a Company" />
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
                  {validationErrors.companyId && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.companyId}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="workLocation.pincode" className="text-sm font-semibold text-gray-800">Pincode</Label>
                  <div className="mt-2 relative">
                    <Input
                      id="workLocation.pincode"
                      type="text"
                      name="workLocation.pincode"
                      value={input.workLocation.pincode}
                      onChange={handlePincodeChange}
                      className={cn(
                        "h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                        (pincodeError || validationErrors['workLocation.pincode']) && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                      placeholder="e.g., 400001"
                    />
                    {fetchingAreas && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </div>
                  {(pincodeError || validationErrors['workLocation.pincode']) && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {pincodeError || validationErrors['workLocation.pincode']}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="workLocation.area" className="text-sm font-semibold text-gray-800">Area</Label>
                  <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={areaOpen}
                        disabled={fetchingAreas || availableAreas.length === 0}
                        className={cn(
                          "w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal",
                          validationErrors['workLocation.area'] && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                      >
                        {input.workLocation.area || (
                          fetchingAreas
                            ? "Loading areas..."
                            : availableAreas.length === 0
                              ? "Enter valid pincode first"
                              : "Select area..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search area..." />
                        <CommandEmpty>No area found for this pincode.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {availableAreas.map((area) => (
                            <CommandItem
                              key={area}
                              value={area}
                              onSelect={() => {
                                selectChangeHandler('workLocation.area', area);
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
                  {validationErrors['workLocation.area'] && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors['workLocation.area']}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="workLocation.streetAddress" className="text-sm font-semibold text-gray-800">Street Address</Label>
                  <Input
                    id="workLocation.streetAddress"
                    type="text"
                    name="workLocation.streetAddress"
                    value={input.workLocation.streetAddress}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors['workLocation.streetAddress'] && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., 123 Main Street, Building 4, Floor 2"
                  />
                  {validationErrors['workLocation.streetAddress'] && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors['workLocation.streetAddress']}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="workLocation.city" className="text-sm font-semibold text-gray-800">City</Label>
                  <Input
                    id="workLocation.city"
                    type="text"
                    name="workLocation.city"
                    value={input.workLocation.city}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors['workLocation.city'] && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., Mumbai"
                  />
                  {validationErrors['workLocation.city'] && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors['workLocation.city']}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="workLocation.state" className="text-sm font-semibold text-gray-800">State</Label>
                  <Popover open={stateOpen} onOpenChange={setStateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={stateOpen}
                        className={cn(
                          "w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal",
                          validationErrors['workLocation.state'] && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                      >
                        {input.workLocation.state || "Select state..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                selectChangeHandler('workLocation.state', state);
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
                  {validationErrors['workLocation.state'] && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors['workLocation.state']}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobType" className="text-sm font-semibold text-gray-800">Job Type</Label>
                  <Select onValueChange={(value) => selectChangeHandler('jobType', value)}>
                    <SelectTrigger className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm",
                      validationErrors.jobType && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}>
                      <SelectValue placeholder="Select job type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {validationErrors.jobType && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.jobType}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="experienceLevel" className="text-sm font-semibold text-gray-800">Experience Level (in years)</Label>
                  <Input
                    id="experienceLevel"
                    type="number"
                    name="experienceLevel"
                    value={input.experienceLevel}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors.experienceLevel && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., 2"
                  />
                  {validationErrors.experienceLevel && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.experienceLevel}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="workplacePlane" className="text-sm font-semibold text-gray-800">Workplace Plane</Label>
                  <Input
                    id="workplacePlane"
                    type="text"
                    name="workplacePlane"
                    value={input.workplacePlane}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors.workplacePlane && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., Office, Remote, Hybrid"
                  />
                  {validationErrors.workplacePlane && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.workplacePlane}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobCategory" className="text-sm font-semibold text-gray-800">Job Category</Label>
                  {isCustomCategory ? (
                    <div className="flex mt-2">
                      <Input
                        id="jobCategory"
                        type="text"
                        name="jobCategory"
                        value={input.jobCategory}
                        onChange={changeEventHandler}
                        className={cn(
                          "flex-1 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-l-xl shadow-sm transition-all duration-200",
                          validationErrors.jobCategory && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
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
                          className={cn(
                            "w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal",
                            validationErrors.jobCategory && "border-red-500 focus:border-red-500 focus:ring-red-500"
                          )}
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
                                  setJobCategoryOpen(false);
                                  setValidationErrors(prev => ({ ...prev, jobCategory: '' }));
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
                  {validationErrors.jobCategory && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.jobCategory}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="salaryRange" className="text-sm font-semibold text-gray-800">Salary Range (optional)</Label>
                  <Input
                    id="salaryRange"
                    type="text"
                    name="salaryRange"
                    value={input.salaryRange}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors.salaryRange && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., 4-6 or 4,6"
                  />
                  {validationErrors.salaryRange && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.salaryRange}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="numberOfPositions" className="text-sm font-semibold text-gray-800">Number of Positions</Label>
                  <Input
                    id="numberOfPositions"
                    type="number"
                    name="numberOfPositions"
                    value={input.numberOfPositions}
                    onChange={changeEventHandler}
                    className={cn(
                      "mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200",
                      validationErrors.numberOfPositions && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="e.g., 1"
                  />
                  {validationErrors.numberOfPositions && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.numberOfPositions}
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-sm transition-all duration-200">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Posting...
                  </div>
                ) : (
                  "Post Job"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;