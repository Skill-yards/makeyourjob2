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
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, User, Briefcase, ArrowLeft } from "lucide-react";
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
  const [showOtpModal, setShowOtpModal] = useState(false);

  const otpRefs = useRef([]);
  const { loading, user } = useSelector((store) => store.auth);
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

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
      if (!input.email || !input.firstname || !input.role) {
        return toast.error("Please enter email, first name, and role to receive OTP");
      }
      if (!isValidRecruiterEmail(input.email)) {
        return toast.error(
          input.role === "candidate"
            ? "Please use a gmail.com, outlook.com, or any .com email address"
            : "Recruiter email must be a company-specific domain (e.g., username@company.com)"
        );
      }
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, {
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        role: input.role,
        gender: input.gender || undefined, // Optional field
      });
      if (res.data.success) {
        setIsOtpSent(true);
        setTimer(120);
        setShowOtpModal(true);
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
        setTimer(120);
        setShowOtpModal(true);
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
        setShowOtpModal(false);
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
    if (!isOtpVerified)
      return toast.error("Please verify OTP before signing up!");

    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("isOtpVerified", true);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-6xl flex bg-white shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300">
          <div className="w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex flex-col justify-center items-center relative">
            <img
              src={input.role === "candidate" ? EmployeesImage : RecruitorImage}
              alt={`${input.role} Illustration`}
              className="w-3/4 h-auto object-cover rounded-xl shadow-lg"
            />
            <div className="mt-6 text-center text-white">
              <h2 className="text-2xl font-bold">Practice to Master Skills</h2>
              <div className="flex justify-center space-x-4 mt-6">
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition">
                  5-Day Interview Prep
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition">
                  Mock Interviews
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition">
                  100-Day Coding Sprint
                </div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-15">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-12"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                ></div>
              ))}
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
                <TabsTrigger
                  value="candidate"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Candidate
                </TabsTrigger>
                <TabsTrigger
                  value="recruiter"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-700"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Recruiter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="candidate">
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <Label htmlFor="firstname">First Name *</Label>
                    <Input
                      id="firstname"
                      type="text"
                      name="firstname"
                      value={input.firstname}
                      onChange={changeEventHandler}
                      placeholder="John"
                      className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                      className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                      placeholder="john.doe@gmail.com"
                      className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    {input.email && !isValidRecruiterEmail(input.email) && (
                      <p className="text-sm text-yellow-600 mt-1">
                        * Please use gmail.com, outlook.com, or any .com email
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={input.gender}
                      onChange={changeEventHandler}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {!isOtpVerified && (
                    <>
                      {!isOtpSent ? (
                        <Button
                          type="button"
                          onClick={sendOtpHandler}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Send OTP
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={resendOtpHandler}
                          disabled={timer > 0}
                          className={`w-full ${
                            timer > 0
                              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                        </Button>
                      )}
                    </>
                  )}
                  {isOtpVerified && (
                    <>
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          type="text"
                          name="phoneNumber"
                          value={input.phoneNumber}
                          onChange={changeEventHandler}
                          placeholder="+1 123-456-7890"
                          className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          name="password"
                          value={input.password}
                          onChange={changeEventHandler}
                          placeholder="********"
                          className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="file">Profile Image</Label>
                        <Input
                          id="file"
                          accept="image/*"
                          type="file"
                          onChange={changeFileHandler}
                          className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  {loading ? (
                    <Button className="w-full bg-blue-600 text-white" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!isOtpVerified}
                    >
                      Next
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
                  <div>
                    <Label htmlFor="firstname">First Name *</Label>
                    <Input
                      id="firstname"
                      type="text"
                      name="firstname"
                      value={input.firstname}
                      onChange={changeEventHandler}
                      placeholder="Jane"
                      className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                      placeholder="Smith"
                      className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                      placeholder="hr@company.com"
                      className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    {input.email && !isValidRecruiterEmail(input.email) && (
                      <p className="text-sm text-yellow-600 mt-1">
                        * Recruiter email must be a company-specific domain (e.g., username@company.com)
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={input.gender}
                      onChange={changeEventHandler}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {!isOtpVerified && (
                    <>
                      {!isOtpSent ? (
                        <Button
                          type="button"
                          onClick={sendOtpHandler}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Send OTP
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={resendOtpHandler}
                          disabled={timer > 0}
                          className={`w-full ${
                            timer > 0
                              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                        </Button>
                      )}
                    </>
                  )}
                  {isOtpVerified && (
                    <>
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          type="text"
                          name="phoneNumber"
                          value={input.phoneNumber}
                          onChange={changeEventHandler}
                          placeholder="+1 123-456-7890"
                          className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          name="password"
                          value={input.password}
                          onChange={changeEventHandler}
                          placeholder="********"
                          className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="file">Company Logo</Label>
                        <Input
                          id="file"
                          accept="image/*"
                          type="file"
                          onChange={changeFileHandler}
                          className="mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  {loading ? (
                    <Button className="w-full bg-blue-600 text-white" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!isOtpVerified}
                    >
                      Next
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

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
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
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowOtpModal(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={verifyOtpHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              disabled={loading || otp.some((d) => !d)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup;