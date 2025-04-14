import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, Briefcase, DollarSign, MapPin, Clock, Building, Tag } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const PostJob = () => {
  const [input, setInput] = useState({
    jobTitle: '',
    description: '',
    requirements: '',
    salaryRangeDiversity: { min: '', max: '', currency: 'USD', frequency: 'yearly' },
    workLocation: { city: '', state: '', country: '' },
    jobType: '',
    experienceLevel: '',
    position: '',
    companyId: '',
    companyName: '',
    jobNature: '',
    workplacePlane: '',
    jobCategory: '',
    skills: '',
    availabilityFrame: { startDate: '' },
    benefits: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  useGetAllCompanies()
  

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

  const selectChangeHandler = (name, value) => {
    if (name === 'companyId') {
      const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
      if (selectedCompany) {
        setInput({ ...input, companyId: selectedCompany._id, companyName: selectedCompany.name });
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'jobTitle', 'description', 'requirements', 'salaryRangeDiversity.min', 'salaryRangeDiversity.max',
      'workLocation.country', 'jobType', 'experienceLevel', 'position', 'companyId', 'jobNature',
      'workplacePlane', 'jobCategory', 'skills', 'availabilityFrame.startDate',
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

    const formattedRequirements = input.requirements.split(',').map((req) => req.trim()).filter(Boolean);
    const formattedSkills = input.skills.split(',').map((skill) => skill.trim()).filter(Boolean);
    const formattedBenefits = input.benefits ? input.benefits.split(',').map((benefit) => benefit.trim()).filter(Boolean) : [];

    const payload = {
      ...input,
      requirements: formattedRequirements,
      skills: formattedSkills,
      benefits: formattedBenefits,
      salaryRangeDiversity: {
        ...input.salaryRangeDiversity,
        min: Number(input.salaryRangeDiversity.min),
        max: Number(input.salaryRangeDiversity.max),
      },
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-20"></div>
          <CardHeader className="relative pt-6 pb-4 px-6">
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-indigo-600" />
              Post a New Job
            </CardTitle>
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
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="companyId" className="text-sm font-medium text-gray-700">Company</Label>
                  <Select onValueChange={(value) => selectChangeHandler('companyId', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
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
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Develop and maintain web applications..."
                  />
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
                    placeholder="e.g., 5+ years experience, JavaScript"
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
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryRangeDiversity.min" className="text-sm font-medium text-gray-700">Min Salary</Label>
                  <Input
                    id="salaryRangeDiversity.min"
                    type="number"
                    name="salaryRangeDiversity.min"
                    value={input.salaryRangeDiversity.min}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., 50000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryRangeDiversity.max" className="text-sm font-medium text-gray-700">Max Salary</Label>
                  <Input
                    id="salaryRangeDiversity.max"
                    type="number"
                    name="salaryRangeDiversity.max"
                    value={input.salaryRangeDiversity.max}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., 70000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryRangeDiversity.currency" className="text-sm font-medium text-gray-700">Currency</Label>
                  <Select onValueChange={(value) => selectChangeHandler('salaryRangeDiversity.currency', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salaryRangeDiversity.frequency" className="text-sm font-medium text-gray-700">Salary Frequency</Label>
                  <Select onValueChange={(value) => selectChangeHandler('salaryRangeDiversity.frequency', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workLocation.city" className="text-sm font-medium text-gray-700">City</Label>
                  <Input
                    id="workLocation.city"
                    type="text"
                    name="workLocation.city"
                    value={input.workLocation.city}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., San Francisco"
                  />
                </div>
                <div>
                  <Label htmlFor="workLocation.state" className="text-sm font-medium text-gray-700">State</Label>
                  <Input
                    id="workLocation.state"
                    type="text"
                    name="workLocation.state"
                    value={input.workLocation.state}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., CA"
                  />
                </div>
                <div>
                  <Label htmlFor="workLocation.country" className="text-sm font-medium text-gray-700">Country</Label>
                  <Input
                    id="workLocation.country"
                    type="text"
                    name="workLocation.country"
                    value={input.workLocation.country}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., USA"
                  />
                </div>
                <div>
                  <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">Job Type</Label>
                  <Select onValueChange={(value) => selectChangeHandler('jobType', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">Experience Level</Label>
                  <Select onValueChange={(value) => selectChangeHandler('experienceLevel', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700">No of Positions</Label>
                  <Input
                    id="position"
                    type="number"
                    name="position"
                    value={input.position}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., 2"
                  />
                </div>
                <div>
                  <Label htmlFor="jobNature" className="text-sm font-medium text-gray-700">Job Nature</Label>
                  <Select onValueChange={(value) => selectChangeHandler('jobNature', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Job Nature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Seasonal">Seasonal</SelectItem>
                      <SelectItem value="Project-Based">Project-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workplacePlane" className="text-sm font-medium text-gray-700">Workplace Type</Label>
                  <Select onValueChange={(value) => selectChangeHandler('workplacePlane', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Workplace Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jobCategory" className="text-sm font-medium text-gray-700">Job Category</Label>
                  <Select onValueChange={(value) => selectChangeHandler('jobCategory', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Job Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Product Management">Product Management</SelectItem>
                      <SelectItem value="Customer Support">Customer Support</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="availabilityFrame.startDate" className="text-sm font-medium text-gray-700">Start Date</Label>
                  <Input
                    id="availabilityFrame.startDate"
                    type="date"
                    name="availabilityFrame.startDate"
                    value={input.availabilityFrame.startDate}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="benefits" className="text-sm font-medium text-gray-700">Benefits (comma-separated, optional)</Label>
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
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    Post Job
                  </>
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