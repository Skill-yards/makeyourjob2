import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { 
  Loader2, 
  User, 
  Building, 
  Mail, 
  Phone, 
  FileText, 
  X, 
  Plus, 
  Code,
  Contact,
  Info
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { Progress } from './ui/progress';

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [progress, setProgress] = useState(0);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    organization: user?.profile?.organization || '',
    jobRole: user?.profile?.jobRole || '',
    file: null,
  });

  // Initialize skills from user data
  useEffect(() => {
    if (user?.profile?.skills) {
      // If skills is already a string, use it directly
      if (typeof user.profile.skills === 'string') {
        setSkills(user.profile.skills);
      } 
      // If skills is an array, convert to comma-separated string
      else if (Array.isArray(user.profile.skills)) {
        setSkills(user.profile.skills.join(', '));
      }
    }
  }, [user]);

  // Calculate profile completion progress
  useEffect(() => {
    let filledFields = 0;
    let totalFields = 0;
    
    // Count basic info fields
    const basicFields = ['firstname', 'lastname', 'email', 'phoneNumber'];
    basicFields.forEach(field => {
      totalFields++;
      if (input[field]) filledFields++;
    });
    
    // Count additional fields based on role
    if (user?.role === 'candidate') {
      totalFields += 2; // bio and skills
      if (input.bio) filledFields++;
      if (skills) filledFields++;
    } else if (user?.role === 'recruiter') {
      totalFields += 2; // organization and jobRole
      if (input.organization) filledFields++;
      if (input.jobRole) filledFields++;
    }
    
    // Add file field
    totalFields++;
    if (input.file || user?.profile?.resumeOriginalName || user?.profile?.profilePhoto) filledFields++;
    
    const calculatedProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(calculatedProgress);
  }, [input, skills, user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkill = skillInput.trim();
      // If skills is empty, just add the new skill
      // Otherwise, add a comma and the new skill
      setSkills(prev => prev ? `${prev}, ${newSkill}` : newSkill);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const skillsArray = skills.split(',').map(s => s.trim());
    const updatedSkills = skillsArray.filter(s => s !== skillToRemove).join(', ');
    setSkills(updatedSkills);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstname', input.firstname);
    formData.append('lastname', input.lastname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);

    if (user?.role === 'candidate') {
      formData.append('bio', input.bio);
      // Append skills as a single string
      formData.append('skills', skills);
    } else if (user?.role === 'recruiter') {
      formData.append('organization', input.organization || '');
      formData.append('jobRole', input.jobRole || '');
    }

    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
        // Reset file input and preview
        setInput(prev => ({ ...prev, file: null }));
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.firstname && !user?.lastname) return "U";
    return `${(user?.firstname?.[0] || "").toUpperCase()}${(user?.lastname?.[0] || "").toUpperCase()}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[1000px] p-0  bg-white rounded-xl shadow-xl h-[500px] overflow-auto">
        <DialogHeader className="pt-2 px-2 pb-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Update Your Profile
          </DialogTitle>
          <DialogDescription className="text-indigo-100">
            Complete your profile to improve your job application experience
          </DialogDescription>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Profile completion</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-indigo-300" indicatorClassName="bg-white" />
          </div>
        </DialogHeader>
        
        <Tabs 
          defaultValue="basic" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start bg-transparent border-b-0 mt-2">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-4 pb-2 text-sm"
              >
                Basic Info
              </TabsTrigger>
              
              {user?.role === 'candidate' && (
                <TabsTrigger 
                  value="candidate" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-4 pb-2 text-sm"
                >
                  Candidate Details
                </TabsTrigger>
              )}
              
              {user?.role === 'recruiter' && (
                <TabsTrigger 
                  value="recruiter" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-4 pb-2 text-sm"
                >
                  Recruiter Details
                </TabsTrigger>
              )}
              
              <TabsTrigger 
                value="file" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-4 pb-2 text-sm"
              >
                Upload
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="px-6 py-4 max-h-[60vh]">
            <form id="profile-form" onSubmit={submitHandler} className="space-y-5">
              <TabsContent value="basic" className="mt-0 space-y-4">
                <div className="flex justify-center mb-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage 
                      src={user?.profile?.profilePhoto || ''} 
                      alt={`${user?.firstname || ''} ${user?.lastname || ''}`} 
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="text-sm font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="firstname"
                        name="firstname"
                        type="text"
                        value={input.firstname}
                        onChange={changeEventHandler}
                        className="pl-9"
                        placeholder="Your first name"
                      />
                      <User className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={input.lastname}
                        onChange={changeEventHandler}
                        className="pl-9"
                        placeholder="Your last name"
                      />
                      <User className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      className="pl-9"
                      placeholder="your.email@example.com"
                    />
                    <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={input.phoneNumber}
                      onChange={changeEventHandler}
                      className="pl-9"
                      placeholder="+1 (555) 123-4567"
                    />
                    <Phone className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setActiveTab(user?.role === 'candidate' ? 'candidate' : 'recruiter')}
                  >
                    Next: {user?.role === 'candidate' ? 'Candidate Details' : 'Recruiter Details'}
                  </Button>
                </div>
              </TabsContent>
              
              {user?.role === 'candidate' && (
                <TabsContent value="candidate" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Professional Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      placeholder="Write a short professional bio"
                      className="min-h-24 resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Skills
                    </Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill (e.g. JavaScript)"
                          className="pl-9"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Code className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                      </div>
                      <Button 
                        type="button" 
                        onClick={addSkill}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {skills && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skills.split(',').map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-800 py-1 px-2 flex items-center gap-1"
                          >
                            {skill.trim()}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill.trim())}
                              className="h-4 w-4 rounded-full bg-indigo-200 text-indigo-800 hover:bg-indigo-300 flex items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('basic')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('file')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Next: Upload Resume
                    </Button>
                  </div>
                </TabsContent>
              )}
              
              {user?.role === 'recruiter' && (
                <TabsContent value="recruiter" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-sm font-medium">
                      Organization
                    </Label>
                    <div className="relative">
                      <Input
                        id="organization"
                        name="organization"
                        value={input.organization}
                        onChange={changeEventHandler}
                        className="pl-9"
                        placeholder="Your company or organization"
                      />
                      <Building className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobRole" className="text-sm font-medium">
                      Job Role
                    </Label>
                    <div className="relative">
                      <Input
                        id="jobRole"
                        name="jobRole"
                        value={input.jobRole}
                        onChange={changeEventHandler}
                        className="pl-9"
                        placeholder="Your position at the company"
                      />
                      <Contact className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('basic')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('file')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Next: Upload Logo
                    </Button>
                  </div>
                </TabsContent>
              )}
              
              <TabsContent value="file" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm font-medium">
                    {user?.role === 'candidate' ? 'Resume (PDF)' : 'Company Logo (Image)'}
                  </Label>
                  
                  <Card className="border-dashed border-2 hover:border-indigo-400 transition-colors p-6">
                    <div className="text-center">
                      {(previewUrl && user?.role === 'recruiter') ? (
                        <div className="flex justify-center mb-4">
                          <img 
                            src={previewUrl} 
                            alt="Logo preview" 
                            className="h-24 w-24 object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                            <FileText className="h-6 w-6 text-indigo-600" />
                          </div>
                        </div>
                      )}
                      
                      {input.file ? (
                        <p className="text-sm font-medium text-indigo-600">
                          {input.file.name}
                        </p>
                      ) : user?.role === 'candidate' && user?.profile?.resumeOriginalName ? (
                        <p className="text-sm font-medium text-indigo-600">
                          Current resume: {user.profile.resumeOriginalName}
                        </p>
                      ) : user?.role === 'recruiter' && user?.profile?.profilePhoto ? (
                        <p className="text-sm font-medium text-indigo-600">
                          Current logo already uploaded
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {user?.role === 'candidate' 
                            ? 'Upload your resume in PDF format' 
                            : 'Upload your company logo (PNG, JPG)'}
                        </p>
                      )}
                      
                      <div className="mt-2">
                        <label htmlFor="file" className="cursor-pointer">
                          <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">
                            {input.file ? 'Change file' : 'Select file'}
                          </div>
                          <Input
                            id="file"
                            name="file"
                            type="file"
                            accept={user?.role === 'candidate' ? "application/pdf" : "image/*"}
                            onChange={fileChangeHandler}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab(user?.role === 'candidate' ? 'candidate' : 'recruiter')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="p-4 border-t bg-gray-50 flex justify-center sm:justify-between">
          <div className="text-xs text-gray-500 hidden sm:block">
            <Info className="h-3 w-3 inline mr-1" />
            Complete your profile to improve job matching
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)}
            className="text-gray-700"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;