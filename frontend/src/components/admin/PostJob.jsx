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
  X as XIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    numberOfPositions: '1', // Default to 1 position
  });

  // State for badges
  const [benefitBadges, setBenefitBadges] = useState([]);

  // State for UI controls
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
  const [benefitInput, setBenefitInput] = useState('');

  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  // Effect to update badges when benefits input changes
  useEffect(() => {
    // Skip initial render or when directly editing
    if (benefitInput !== input.benefits && input.benefits) {
      // Split benefits by comma and create badges
      const newBadges = input.benefits
        .split(',')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit !== '');

      setBenefitBadges(newBadges);
    }
  }, [input.benefits]);

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
          // Extract unique area names from post office data
          const areas = result.PostOffice.map(office => office.Name);

          // If areas are found, also automatically set city and state from first post office
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
      setPincodeError('Error fetching location details. Please try again.');
      setAvailableAreas([]);
    } finally {
      setFetchingAreas(false);
    }
  };

  // Debounce function to prevent too many API calls
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

  // Create debounced version of fetchPincodeDetails
  const debouncedFetchPincodeDetails = React.useCallback(
    debounce(fetchPincodeDetails, 800),
    []
  );

  useEffect(() => {
    // When pincode changes and is valid length, fetch areas
    const pincode = input.workLocation.pincode;
    if (pincode && pincode.length === 6) {
      debouncedFetchPincodeDetails(pincode);
    } else if (pincode && pincode.length > 0 && pincode.length < 6) {
      // When pincode is being typed but not complete
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
  };

  const handleBenefitInputChange = (e) => {
    const value = e.target.value;
    setBenefitInput(value);

    // If the user types a comma, create a new badge
    if (value.endsWith(',')) {
      const benefitText = value.slice(0, -1).trim();

      if (benefitText && !benefitBadges.includes(benefitText)) {
        const newBadges = [...benefitBadges, benefitText];
        setBenefitBadges(newBadges);
        setBenefitInput('');

        // Update the input.benefits with the comma-separated string
        setInput({
          ...input,
          benefits: newBadges.join(', ')
        });
      } else {
        setBenefitInput('');
      }
    } else {
      // Otherwise just update the temporary input
      setBenefitInput(value);
    }
  };

  const handleBenefitKeyDown = (e) => {
    // Add badge on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      const benefitText = benefitInput.trim();

      if (benefitText && !benefitBadges.includes(benefitText)) {
        const newBadges = [...benefitBadges, benefitText];
        setBenefitBadges(newBadges);
        setBenefitInput('');

        // Update the input.benefits with the comma-separated string
        setInput({
          ...input,
          benefits: newBadges.join(', ')
        });
      }
    }
  };

  const removeBenefitBadge = (indexToRemove) => {
    const newBadges = benefitBadges.filter((_, index) => index !== indexToRemove);
    setBenefitBadges(newBadges);

    // Update the input.benefits with the comma-separated string
    setInput({
      ...input,
      benefits: newBadges.join(', ')
    });
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
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value.trim();
    // Only allow numeric values and max 6 digits
    if (pincode === '' || (/^\d*$/.test(pincode) && pincode.length <= 6)) {
      setInput({
        ...input,
        workLocation: {
          ...input.workLocation,
          pincode: pincode,
          // Reset area when pincode changes
          area: ''
        },
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'jobTitle', 'jobDescription', 'workLocation.city', 'workLocation.state',
      'workLocation.pincode', 'workLocation.area', 'workLocation.streetAddress',
      'jobType', 'experienceLevel', 'companyId', 'workplacePlane', 'jobCategory',
      'skills', 'numberOfPositions'
    ];

    for (const field of requiredFields) {
      const [parent, child] = field.split('.');
      if (child) {
        if (!input[parent][child]) {
          toast.error(`Please fill in ${field.replace('.', ' ')}`);
          return;
        }
      } else if (!input[field]) {
        toast.error(`Please fill in ${field}`);
        return;
      }
    }

    // Validate salary range (optional field)
    let formattedSalaryRange = { minSalary: null, maxSalary: null };
    if (input.salaryRange) {
      const salaryParts = input.salaryRange.split(/[,|-]/).map(part => part.trim());
      if (salaryParts.length !== 2) {
        toast.error('Please enter a valid salary range (e.g., 4-6 or 4,6)');
        return;
      }
      const [min, max] = salaryParts.map(val => parseFloat(val));
      if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
        toast.error('Please enter a valid salary range (min ≤ max, both non-negative)');
        return;
      }
      formattedSalaryRange = { minSalary: min, maxSalary: max };
    }

    // Validate number of positions
    const positions = parseInt(input.numberOfPositions);
    if (isNaN(positions) || positions < 1) {
      toast.error('Please enter a valid number of positions (minimum 1)');
      return;
    }

    // Validate experience level (should be a number)
    const experience = parseFloat(input.experienceLevel);
    if (isNaN(experience) || experience < 0) {
      toast.error('Please enter a valid experience level in years');
      return;
    }

    const formattedSkills = input.skills.split(',').map((skill) => skill.trim()).filter(Boolean);
    const formattedBenefits = benefitBadges.filter(Boolean);

    const payload = {
      ...input,
      skills: formattedSkills,
      benefits: formattedBenefits,
      salaryRange: formattedSalaryRange,
      numberOfPositions: positions,
      experienceLevel: experience.toString()
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
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                {/* Job Title Field with Custom Input Option */}
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
                        className="flex-1 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-l-xl shadow-sm transition-all duration-200"
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
                          className="w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal"
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
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="jobDescription" className="text-sm font-semibold text-gray-800">Job Description</Label>
                  <Input
                    id="jobDescription"
                    type="text"
                    name="jobDescription"
                    value={input.jobDescription}
                    onChange={changeEventHandler}
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., Develop and maintain web applications..."
                  />
                </div>

                <div>
                  <Label htmlFor="skills" className="text-sm font-semibold text-gray-800">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    type="text"
                    name="skills"
                    value={input.skills}
                    onChange={changeEventHandler}
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>

                {/* Benefits field with badges */}
                <div>
                  <Label htmlFor="benefits" className="text-sm font-semibold text-gray-800">Benefits</Label>
                  <Input
                    id="benefits"
                    type="text"
                    value={benefitInput}
                    onChange={handleBenefitInputChange}
                    onKeyDown={handleBenefitKeyDown}
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="Type benefit and press Enter or comma to add"
                  />
                  {benefitBadges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {benefitBadges.map((benefit, index) => (
                        <Badge
                          key={index}
                          className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 gap-1 pl-3 pr-2 py-1"
                        >
                          {benefit}
                          <button
                            type="button"
                            onClick={() => removeBenefitBadge(index)}
                            className="text-indigo-600 hover:text-indigo-800 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 p-1"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="companyId" className="text-sm font-semibold text-gray-800">Company</Label>
                  <Select onValueChange={(value) => selectChangeHandler('companyId', value)}>
                    <SelectTrigger className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm">
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
                </div>

                {/* Pincode Field with API Integration */}
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
                        pincodeError && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                      placeholder="e.g., 400001"
                    />
                    {fetchingAreas && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </div>
                  {pincodeError && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {pincodeError}
                    </div>
                  )}
                </div>

                {/* Area Field - Populated based on Pincode */}
                <div>
                  <Label htmlFor="workLocation.area" className="text-sm font-semibold text-gray-800">Area</Label>
                  <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={areaOpen}
                        disabled={fetchingAreas || availableAreas.length === 0}
                        className="w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal"
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
                </div>

                {/* Street Address Field */}
                <div>
                  <Label htmlFor="workLocation.streetAddress" className="text-sm font-semibold text-gray-800">Street Address</Label>
                  <Input
                    id="workLocation.streetAddress"
                    type="text"
                    name="workLocation.streetAddress"
                    value={input.workLocation.streetAddress}
                    onChange={changeEventHandler}
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., 123 Main Street, Building 4, Floor 2"
                  />
                </div>

                <div>
                  <Label htmlFor="workLocation.city" className="text-sm font-semibold text-gray-800">City</Label>
                  <Input
                    id="workLocation.city"
                    type="text"
                    name="workLocation.city"
                    value={input.workLocation.city}
                    onChange={changeEventHandler}
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <Label htmlFor="workLocation.state" className="text-sm font-semibold text-gray-800">State</Label>
                  <Popover open={stateOpen} onOpenChange={setStateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={stateOpen}
                        className="w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal"
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
                </div>

                {/* Job Type Field with Select Tag */}
                <div>
                  <Label htmlFor="jobType" className="text-sm font-semibold text-gray-800">Job Type</Label>
                  <Select onValueChange={(value) => selectChangeHandler('jobType', value)}>
                    <SelectTrigger className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm">
                      <SelectValue placeholder="Select job type" />
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
                </div>

                <div>
                  <Label htmlFor="experienceLevel" className="text-sm font-semibold text-gray-800">Experience Level (in years)</Label>
                  <Input
                    id="experienceLevel"
                    type="number"
                    name="experienceLevel"
                    value={input.experienceLevel}
                    onChange={changeEventHandler}
                    min="0"
                    step="0.1"
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., 2"
                  />
                </div>

                <div>
                  <Label htmlFor="workplacePlane" className="text-sm font-semibold text-gray-800">Workplace Plane</Label>
                  <Input
                    id="workplacePlane"
                    type="text"
                    name="workplacePlane"
                    value={input.workplacePlane}
                    onChange={changeEventHandler}
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., On-site, Remote, Hybrid"
                  />
                </div>

                {/* Job Category Field with Custom Input Option */}
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
                        className="flex-1 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-l-xl shadow-sm transition-all duration-200"
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
                          className="w-full justify-between mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm text-left font-normal"
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
                </div>

                <div>
                  <Label htmlFor="salaryRange" className="text-sm font-semibold text-gray-800">Salary Range (optional)</Label>
                  <Input
                    id="salaryRange"
                    type="text"
                    name="salaryRange"
                    value={input.salaryRange}
                    onChange={changeEventHandler}
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., 4-6 or 4,6"
                  />
                </div>

                {/* Number of Positions Field */}
                <div>
                  <Label htmlFor="numberOfPositions" className="text-sm font-semibold text-gray-800">Number of Positions</Label>
                  <Input
                    id="numberOfPositions"
                    type="number"
                    name="numberOfPositions"
                    value={input.numberOfPositions}
                    onChange={changeEventHandler}
                    min="1"
                    className="mt-2 h-12 border-gray-200 bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Posting...
                  </>
                ) : (
                  'Post Job'
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
