import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, User, Briefcase, Lock, Mail } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import Navbar from "../shared/Navbar";
import personImage from "../../../public/Employees.png";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "candidate",
    newPassword: "",
    stage: "login", // login, otp, reset
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [sendOtpCooldown, setSendOtpCooldown] = useState(false);

  const otpRefs = useRef([]);
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isOtpSent) {
      setIsOtpSent(false);
      setSentOtp("");
      setOtp(["", "", "", "", "", ""]);
    }
    return () => clearInterval(interval);
  }, [timer, isOtpSent]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
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

  const isValidEmail = (email) => {
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
      return domain.endsWith(".com") || domain.endsWith(".org") || domain.endsWith(".net") || domain.endsWith(".in");
    }
    return false;
  };

  const sendOtpHandler = async (e, purpose = "login") => {
    e.preventDefault();
    if (sendOtpCooldown) return;

    if (!input.email || !isValidEmail(input.email)) {
      return toast.error(
        input.role === "candidate"
          ? "Please use gmail.com, outlook.com, or .com email"
          : "Recruiter email must be a company-specific domain"
      );
    }

    try {
      toast.info("Sending OTP...", { duration: 1000 });
      dispatch(setLoading(true));
      setSendOtpCooldown(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/send-otp`,
        {
          email: input.email,
          role: input.role,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        }
      );
      if (res.data.success) {
        setIsOtpSent(true);
        setTimer(60);
        setSentOtp(res.data.otp);
        setInput({ ...input, stage: purpose === "login" ? "otp" : "reset" });
        toast.success("OTP sent! Check your inbox.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setLoading(false));
      setTimeout(() => setSendOtpCooldown(false), 3000);
    }
  };

  const resendOtpHandler = async (e) => {
    e.preventDefault();
    if (sendOtpCooldown) return;

    try {
      dispatch(setLoading(true));
      setSendOtpCooldown(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/send-otp`,
        {
          email: input.email,
          role: input.role,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        }
      );
      if (res.data.success) {
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setSentOtp(res.data.otp);
        toast.success("OTP resent!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP resend failed");
    } finally {
      dispatch(setLoading(false));
      setTimeout(() => setSendOtpCooldown(false), 3000);
    }
  };

  const loginWithPasswordHandler = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      return toast.error("Email and password are required");
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        {
          email: input.email,
          password: input.password,
          role: input.role,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 5000,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate(input.role === "recruiter" ? "/admin/profile" : "/profile");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginWithOtpHandler = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (!enteredOtp || enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (enteredOtp !== sentOtp) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/login-otp`,
        {
          email: input.email,
          role: input.role,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 5000,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate(input.role === "recruiter" ? "/admin/profile" : "/profile");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (!enteredOtp || enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    if (enteredOtp !== sentOtp) {
      toast.error("Invalid OTP");
      return;
    }
    if (!input.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        {
          email: input.email,
          newPassword: input.newPassword,
          role: input.role,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        }
      );

      if (res.data.success) {
        toast.success("Password reset successfully! Please login.");
        setInput({ ...input, stage: "login", password: "", newPassword: "" });
        setIsOtpSent(false);
        setSentOtp("");
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4 py-6">
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden transform transition duration-300">
          {/* Image Section - Hidden on mobile */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 p-6 sm:p-8 flex flex-col justify-center items-center">
            <img
              src={personImage}
              alt="Login Illustration"
              className="w-3/4 h-auto object-cover rounded-xl shadow-lg"
            />
            <div className="mt-6 text-center text-white">
              <h2 className="text-xl sm:text-2xl font-bold">Unlock Your Potential</h2>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition text-sm">
                  5-Day Interview Prep
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition text-sm">
                  Mock Interviews
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition text-sm">
                  100-Day Coding Sprint
                </div>
              </div>
            </div>
          </div>
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">Welcome Back</h1>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">Access your account</p>

            <Tabs
              value={input.role}
              onValueChange={(value) => setInput({ ...input, role: value })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="candidate"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-700 text-sm sm:text-base"
                >
                  <User className="w-4 h-4 mr-2" /> Candidate
                </TabsTrigger>
                <TabsTrigger
                  value="recruiter"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-700 text-sm sm:text-base"
                >
                  <Briefcase className="w-4 h-4 mr-2" /> Recruiter
                </TabsTrigger>
              </TabsList>

              <TabsContent value={input.role}>
                {input.stage === "login" && (
                  <form onSubmit={loginWithPasswordHandler} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                        <Mail className="h-4 w-4" /> Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder={input.role === "candidate" ? "john.doe@gmail.com" : "hr@company.com"}
                        className="mt-1 w-full border-gray-300 rounded-md text-sm sm:text-base"
                        required
                      />
                      {input.email && !isValidEmail(input.email) && (
                        <p className="text-yellow-600 text-xs sm:text-sm mt-1">
                          * {input.role === "candidate" ? "Use gmail.com, outlook.com, or .com email" : "Use a company-specific domain"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                        <Lock className="h-4 w-4" /> Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        placeholder="••••••••"
                        className="mt-1 w-full border-gray-300 rounded-md text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                      <Button
                        type="button"
                        variant="link"
                        onClick={(e) => sendOtpHandler(e, "login")}
                        className="text-blue-600 text-xs sm:text-sm p-0 w-full sm:w-auto"
                        disabled={loading || !input.email || !isValidEmail(input.email)}
                      >
                        Login with OTP
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setInput({ ...input, stage: "reset" })}
                        className="text-blue-600 text-xs sm:text-sm p-0 w-full sm:w-auto"
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 text-sm sm:text-base"
                      disabled={loading || !input.email || !input.password}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login with Password"}
                    </Button>
                  </form>
                )}

                {input.stage === "otp" && (
                  <form onSubmit={loginWithOtpHandler} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Enter OTP sent to {input.email}</Label>
                      <p className="text-xs sm:text-sm text-gray-500">Check your inbox or spam folder.</p>
                      <div className="flex gap-1 sm:gap-2">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            ref={(el) => (otpRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-2xl font-bold border-gray-300 rounded"
                          />
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Button
                          variant="outline"
                          onClick={resendOtpHandler}
                          disabled={timer > 0 || loading || sendOtpCooldown}
                          className="w-full sm:w-auto text-sm sm:text-base"
                        >
                          Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading || otp.some((d) => !d)}
                          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
                        >
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login with OTP"}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setInput({ ...input, stage: "login" })}
                        className="text-blue-600 text-xs sm:text-sm w-full"
                      >
                        Back to Password Login
                      </Button>
                    </div>
                  </form>
                )}

                {input.stage === "reset" && !isOtpSent && (
                  <form onSubmit={(e) => sendOtpHandler(e, "reset")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                        <Mail className="h-4 w-4" /> Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder={input.role === "candidate" ? "john.doe@gmail.com" : "hr@company.com"}
                        className="mt-1 w-full border-gray-300 rounded-md text-sm sm:text-base"
                        required
                      />
                      {input.email && !isValidEmail(input.email) && (
                        <p className="text-yellow-600 text-xs sm:text-sm mt-1">
                          * {input.role === "candidate" ? "Use gmail.com, outlook.com, or .com email" : "Use a company-specific domain"}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 text-sm sm:text-base"
                      disabled={loading || sendOtpCooldown || !input.email || !isValidEmail(input.email)}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP to Reset"}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setInput({ ...input, stage: "login" })}
                      className="text-blue-600 text-xs sm:text-sm w-full"
                    >
                      Back to Login
                    </Button>
                  </form>
                )}

                {input.stage === "reset" && isOtpSent && (
                  <form onSubmit={resetPasswordHandler} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Enter OTP sent to {input.email}</Label>
                      <p className="text-xs sm:text-sm text-gray-500">Check your inbox or spam folder.</p>
                      <div className="flex gap-1 sm:gap-2">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            ref={(el) => (otpRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-2xl font-bold border-gray-300 rounded"
                          />
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                          <Lock className="h-4 w-4" /> New Password *
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          name="newPassword"
                          value={input.newPassword}
                          onChange={changeEventHandler}
                          placeholder="••••••••"
                          className="mt-1 w-full border-gray-300 rounded-md text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Button
                          variant="outline"
                          onClick={resendOtpHandler}
                          disabled={timer > 0 || loading || sendOtpCooldown}
                          className="w-full sm:w-auto text-sm sm:text-base"
                        >
                          Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading || otp.some((d) => !d) || !input.newPassword}
                          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
                        >
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setInput({ ...input, stage: "login" })}
                        className="text-blue-600 text-xs sm:text-sm w-full"
                      >
                        Back to Login
                      </Button>
                    </div>
                  </form>
                )}
                <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                    Create one now
                  </Link>
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;