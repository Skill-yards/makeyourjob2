import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    role: "candidate",
    gender: "",
    file: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpRefs = useRef([]);
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const isValidRecruiterEmail = (email) => {
    if (!email || typeof email !== "string") return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) return false;

    const [localPart, domain] = trimmedEmail.split("@");
    if (!localPart || !domain) return false;

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
      const validDomainEndings = [
        ".com",
        ".co",
        ".org",
        ".net",
        ".biz",
        ".in",
        ".tech",
        ".io",
        ".ai",
        ".info",
        ".edu",
      ];
      return validDomainEndings.some((ending) => domain.endsWith(ending));
    }

    return false;
  };

  const sendOtpHandler = async () => {
    try {
      if (!input.email || !input.firstname || !input.role || !input.gender) {
        return toast.error("Please enter email, first name, role, and gender to receive OTP");
      }
      
      if (!isValidRecruiterEmail(input.email)) {
        return toast.error(
          input.role === "candidate"
            ? "Please use a gmail.com, outlook.com, or any .com email address"
            : "Recruiter email must be a company-specific domain (e.g., username@company.com)"
        );
      }
      
      const formData = new FormData();
      formData.append("firstname", input.firstname);
      formData.append("lastname", input.lastname || "");
      formData.append("email", input.email);
      formData.append("role", input.role);
      formData.append("gender", input.gender);
      formData.append("password", input.password);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("isOtpVerified", "false");
      if (input.file) formData.append("file", input.file);

      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        setIsOtpSent(true);
        setTimer(60);
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      return toast.error("Please verify OTP before signing up!");
    }

    if (!input.phoneNumber || !input.password) {
      return toast.error("Phone number and password are required to complete signup");
    }

    const formData = new FormData();
    formData.append("firstname", input.firstname);
    formData.append("lastname", input.lastname || "");
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("gender", input.gender);
    formData.append("isOtpVerified", "true");
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderFormFields = () => (
    <>
      <div>
        <Label htmlFor="firstname">First Name *</Label>
        <Input
          id="firstname"
          type="text"
          name="firstname"
          value={input.firstname}
          onChange={changeEventHandler}
          placeholder="John"
        />
      </div>
      <div>
        <Label htmlFor="lastname">Last Name</Label>
        <Input
          id="lastname"
          type="text"
          name="lastname"
          value={input.lastname}
          onChange={changeEventHandler}
          placeholder="Doe"
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={input.email}
          onChange={changeEventHandler}
          placeholder={input.role === "candidate" ? "john.doe@gmail.com" : "hr@company.com"}
        />
        {input.email && !isValidRecruiterEmail(input.email) && (
          <p className="text-yellow-600 text-sm mt-1">
            * {input.role === "candidate"
              ? "Please use gmail.com, outlook.com, or any .com email"
              : "Recruiter email must be a company-specific domain"}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          type="text"
          name="phoneNumber"
          value={input.phoneNumber}
          onChange={changeEventHandler}
          placeholder="+1 123-456-7890"
        />
      </div>
      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          name="password"
          value={input.password}
          onChange={changeEventHandler}
          placeholder="********"
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender *</Label>
        <Select
          name="gender"
          value={input.gender}
          onValueChange={(value) => setInput({ ...input, gender: value })}
        >
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
        <Label htmlFor="file">{input.role === "candidate" ? "Profile Image" : "Company Logo"}</Label>
        <Input
          id="file"
          accept="image/*"
          type="file"
          onChange={changeFileHandler}
        />
      </div>
    </>
  );

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
                <div className="bg-white bg-opacity-30 p-3 rounded-lg">5-Day Interview Prep</div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg">Mock Interviews</div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg">100-Day Coding Sprint</div>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Create Your Account
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Join to find your dream job or hire top talent
            </p>

            <Tabs
              value={input.role}
              onValueChange={(value) => setInput({ ...input, role: value })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="candidate">
                  <User className="w-4 h-4 mr-2" />
                  Candidate
                </TabsTrigger>
                <TabsTrigger value="recruiter">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Recruiter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="candidate">
                <form onSubmit={submitHandler} className="space-y-4">
                  {renderFormFields()}
                  {!isOtpVerified && (
                    <>
                      {!isOtpSent ? (
                        <Button
                          type="button"
                          onClick={sendOtpHandler}
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Send OTP
                        </Button>
                      ) : (
                        <p className="text-center text-sm text-gray-600">
                          OTP sent! Please check your email.
                        </p>
                      )}
                    </>
                  )}
                  {isOtpVerified && (
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Sign Up
                    </Button>
                  )}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-medium">
                      Login
                    </Link>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="recruiter">
                <form onSubmit={submitHandler} className="space-y-4">
                  {renderFormFields()}
                  {!isOtpVerified && (
                    <>
                      {!isOtpSent ? (
                        <Button
                          type="button"
                          onClick={sendOtpHandler}
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Send OTP
                        </Button>
                      ) : (
                        <p className="text-center text-sm text-gray-600">
                          OTP sent! Please check your email.
                        </p>
                      )}
                    </>
                  )}
                  {isOtpVerified && (
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Sign Up
                    </Button>
                  )}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-medium">
                      Login
                    </Link>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={isOtpSent && !isOtpVerified} onOpenChange={(open) => !open && setIsOtpSent(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Enter OTP
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-600 mb-6">
              Please enter the 6-digit code sent to {input.email}
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
                  className="w-12 h-12 text-center text-2xl font-bold"
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
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Verify OTP
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup;