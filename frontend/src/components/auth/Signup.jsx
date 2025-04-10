import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, User, Briefcase } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import Navbar from "../shared/Navbar";
import EmployeesImage from "../../../public/Employees.png";
import RecruitorImage from "../../../public/recruitorImages.jpg";

const Signup = () => {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
    gender: "",
    file: null,
    organization: "",
    jobRole: "",
    step: 1, // 1 = Role, 2 = Basic Info, 3 = OTP, 4 = Additional Info (Recruiter)
    agreedToTerms: false,
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpRefs = useRef([]);
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reset organization and jobRole when role changes
  useEffect(() => {
    if (input.role === "candidate") {
      setInput((prev) => ({ ...prev, organization: "", jobRole: "" }));
    }
  }, [input.role]);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isOtpSent) {
      setIsOtpSent(false);
    }
    return () => clearInterval(interval);
  }, [timer, isOtpSent]);

  // Format timer for display
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  // Handle checkbox for terms
  const handleTermsChange = (checked) => {
    setInput({ ...input, agreedToTerms: checked });
  };

  // Validate email based on role
  const isValidRecruiterEmail = (email) => {
    if (!email || typeof email !== "string") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) return false;
    const [, domain] = trimmedEmail.split("@");
    const publicDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "protonmail.com",
      "icloud.com",
      "aol.com",
      "zoho.com",
    ];
    if (input.role === "candidate") {
      return domain === "gmail.com" || domain === "outlook.com" || domain.endsWith(".com");
    } else if (input.role === "recruiter") {
      if (publicDomains.includes(domain)) return false;
      const validDomainEndings = [".com", ".co", ".org", ".net", ".biz", ".in", ".tech", ".io", ".ai", ".info", ".edu"];
      return validDomainEndings.some((ending) => domain.endsWith(ending));
    }
    return false;
  };

  // Send OTP to email
  const sendOtpHandler = async () => {
    try {
      if (!input.email || !input.firstname || !input.role || !input.gender || !input.password || !input.confirmPassword) {
        return toast.error("All fields with * are required to receive OTP");
      }
      if (input.password !== input.confirmPassword) {
        return toast.error("Passwords do not match");
      }
      if (!input.agreedToTerms) {
        return toast.error("Please agree to the Privacy Policy and Terms of Use");
      }
      if (!isValidRecruiterEmail(input.email)) {
        return toast.error(
          input.role === "candidate"
            ? "Please use gmail.com, outlook.com, or any .com email"
            : "Recruiter email must be a company-specific domain"
        );
      }

      const formData = new FormData();
      formData.append("firstname", input.firstname);
      formData.append("lastname", input.lastname || "");
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber || "");
      formData.append("password", input.password);
      formData.append("role", input.role);
      formData.append("gender", input.gender);
      formData.append("isOtpVerified", "false");
      if (input.file) formData.append("file", input.file);
      formData.append("organization", input.organization || "");
      formData.append("jobRole", input.jobRole || "");

      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        setIsOtpSent(true);
        setTimer(60);
        setInput((prev) => ({ ...prev, step: 3 })); // Move to OTP step
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Resend OTP
  const resendOtpHandler = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/reset-otp/otp`, {
        email: input.email,
      });
      if (res.data.success) {
        toast.success("OTP resent successfully");
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast.error("Unable to resend OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP resend failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Verify OTP
  const verifyOtpHandler = async () => {
    try {
      dispatch(setLoading(true));
      const otpValue = otp.join("");
      const res = await axios.post(`${USER_API_END_POINT}/verify/otp`, {
        email: input.email,
        otp: otpValue,
      });
      if (res.data.success) {
        setIsOtpVerified(true);
        if (input.role === "candidate") {
          // For candidates, submit directly after OTP verification
          await submitHandler(); // Trigger submission
        } else {
          setInput((prev) => ({ ...prev, step: 4 })); // Move to Step 4 for recruiters
        }
        toast.success("OTP verified successfully");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Submit final registration after Step 4 or for candidates after OTP
  const submitHandler = async (e) => {
    // Handle case where event is undefined (e.g., called from verifyOtpHandler)
    if (e) e.preventDefault();

    if (input.step === 4 && input.role === "recruiter" && (!input.organization.trim() || !input.jobRole.trim())) {
      return toast.error("Organization and job role are required for recruiters and cannot be empty");
    }

    const formData = new FormData();
    formData.append("firstname", input.firstname);
    formData.append("lastname", input.lastname || "");
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber || "");
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("gender", input.gender);
    formData.append("isOtpVerified", "true");
    if (input.file) formData.append("file", input.file);
    formData.append("organization", input.organization || "");
    formData.append("jobRole", input.jobRole || "");

    // Console log the data before submitting
    console.log("Submitting data:", {
      firstname: input.firstname,
      lastname: input.lastname || "",
      email: input.email,
      phoneNumber: input.phoneNumber || "",
      password: input.password,
      role: input.role,
      gender: input.gender,
      isOtpVerified: "true",
      file: input.file ? input.file.name : null,
      organization: input.organization || "",
      jobRole: input.jobRole || "",
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user)); // Store the full user object in Redux
        toast.success(res.data.message);
        // Redirect based on role
        const redirectRoute = input.role === "recruiter" ? "/admin/companies" : "/profile";
        navigate(redirectRoute);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Navigate through steps
  const nextStep = () => {
    if (input.step === 1 && !input.role) return toast.error("Please select a role");
    if (input.step === 2) sendOtpHandler();
    else if (input.step === 3 && isOtpVerified) setInput((prev) => ({ ...prev, step: input.role === "recruiter" ? 4 : 5 }));
    else if (input.step === 4) submitHandler(); // Call submitHandler directly for recruiters
    else setInput((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    if (input.step === 4) setInput((prev) => ({ ...prev, step: 3 }));
    else if (input.step === 3) setIsOtpSent(false);
    else setInput((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  // Render appropriate step
  const renderStep = () => {
    switch (input.step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Create a new account</h2>
            <p className="text-center text-gray-600">Join Unstop and find your dream job or recruit talented candidates</p>
            <div className="flex justify-center space-x-4">
              <Button
                variant={input.role === "candidate" ? "default" : "outline"}
                className="flex items-center space-x-2"
                onClick={() => setInput({ ...input, role: "candidate" })}
              >
                <User className="w-4 h-4" />
                <span>Candidate</span>
              </Button>
              <Button
                variant={input.role === "recruiter" ? "default" : "outline"}
                className="flex items-center space-x-2"
                onClick={() => setInput({ ...input, role: "recruiter" })}
              >
                <Briefcase className="w-4 h-4" />
                <span>Recruiter</span>
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Sign up as {input.role}</h2>
            <div>
              <Label htmlFor="firstname">First Name *</Label>
              <Input id="firstname" name="firstname" value={input.firstname} onChange={changeEventHandler} placeholder="John" />
            </div>
            <div>
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" name="lastname" value={input.lastname} onChange={changeEventHandler} placeholder="Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" value={input.email} onChange={changeEventHandler} placeholder={input.role === "candidate" ? "john.doe@gmail.com" : "hr@company.com"} />
              {input.email && !isValidRecruiterEmail(input.email) && (
                <p className="text-yellow-600 text-sm mt-1">
                  * {input.role === "candidate" ? "Use gmail.com, outlook.com, or .com email" : "Use a company-specific domain"}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="+91 123-456-7890" />
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select name="gender" value={input.gender} onValueChange={(value) => setInput({ ...input, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input id="password" name="password" type="password" value={input.password} onChange={changeEventHandler} placeholder="********" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={input.confirmPassword} onChange={changeEventHandler} placeholder="********" />
              {input.password && input.confirmPassword && input.password !== input.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
              )}
            </div>
            <div>
              <Label htmlFor="file">{input.role === "candidate" ? "Profile Image" : "Company Logo"}</Label>
              <Input id="file" accept="image/*" type="file" onChange={changeFileHandler} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={input.agreedToTerms} onCheckedChange={handleTermsChange} />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                All your information is collected, stored and processed as per our data processing guidelines. By signing up on Unstop, you agree to our{" "}
                <Link to="#" className="text-blue-600 underline">Privacy Policy</Link> and{" "}
                <Link to="#" className="text-blue-600 underline">Terms of Use</Link>.
              </Label>
            </div>
          </form>
        );
      case 3:
        return isOtpSent ? (
          <Dialog open={true} onOpenChange={(open) => !open && prevStep()}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Please verify your email</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-gray-600 mb-6">
                  Enter the One Time Password (OTP) which has been sent to {input.email}
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-2xl font-bold border-gray-300 rounded"
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={resendOtpHandler}
                    disabled={timer > 0 || loading}
                  >
                    Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                  </Button>
                  <Button
                    onClick={verifyOtpHandler}
                    disabled={loading || otp.some((d) => !d)}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Email"}
                  </Button>
                </div>
                <p className="text-center text-sm text-red-600 mt-2">
                  Didn’t receive OTP? Resend in {formatTime(timer)}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ) : null;
      case 4:
        return input.role === "recruiter" ? (
          <form onSubmit={submitHandler} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Ready to be Unstoppable!</h2>
            <p className="text-center text-gray-600">Let's add some basic information</p>
            <div>
              <Label htmlFor="organization">Current Organization *</Label>
              <Input
                id="organization"
                name="organization"
                value={input.organization}
                onChange={changeEventHandler}
                placeholder="Company name"
                className="mt-1"
              />
              {!input.organization.trim() && (
                <p className="text-red-600 text-sm mt-1">Organization is required</p>
              )}
            </div>
            <div>
              <Label htmlFor="jobRole">Current Job Role *</Label>
              <Input
                id="jobRole"
                name="jobRole"
                value={input.jobRole}
                onChange={changeEventHandler}
                placeholder="Job Role"
                className="mt-1"
              />
              {!input.jobRole.trim() && (
                <p className="text-red-600 text-sm mt-1">Job Role is required</p>
              )}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep} disabled={loading}>
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || !input.organization.trim() || !input.jobRole.trim()}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            </div>
          </form>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-6xl flex bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex flex-col justify-center items-center">
            <img
              src={input.role === "candidate" ? EmployeesImage : RecruitorImage}
              alt={`${input.role} Illustration`}
              className="w-3/4 h-auto object-cover rounded-xl shadow-lg"
            />
            <div className="mt-6 text-center text-white">
              <h2 className="text-2xl font-bold">Practice to Master Skills</h2>
              <div className="flex justify-center space-x-4 mt-6">
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md">5-Day Interview Prep</div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md">Mock Interviews</div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md">100-Day Coding Sprint</div>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-8 flex flex-col justify-center">
            <div className="space-y-6">
              {renderStep()}
              {(input.step === 1 || input.step > 1 && input.step < 4) && (
                <div className="flex justify-between mt-6">
                  {input.step > 1 && input.step !== 3 && (
                    <Button variant="outline" onClick={prevStep} disabled={input.step === 1 || loading}>
                      Back
                    </Button>
                  )}
                  {(input.step === 1 || input.step < 3) && (
                    <Button
                      onClick={nextStep}
                      disabled={loading || (input.step === 2 && (!input.agreedToTerms || input.password !== input.confirmPassword || !isValidRecruiterEmail(input.email) || !input.gender || !input.phoneNumber || !input.email || !input.firstname || !input.password || !input.confirmPassword)) || (input.step === 3 && !isOtpVerified)}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;