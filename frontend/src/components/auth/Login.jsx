import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, LogIn, Mail, Lock, User, Briefcase, Key } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import Navbar from "../shared/Navbar";
import personImage from "../../../public/Employees.png";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "candidate",
    otp: "",
    newPassword: "",
    stage: "password", // Added stage state for flow control
  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Login with Password
  const submitHandlerPassword = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, {
        email: input.email,
        password: input.password,
        role: input.role,
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Request OTP (for Forgot Password or OTP Login)
  const requestOtpHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/request-otp`, {
        email: input.email,
        role: input.role,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        toast.success("OTP sent to your email!");
        // Transition to forgot-otp stage after successful OTP request
        setInput((prev) => ({ ...prev, stage: "forgot-otp" }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Login with OTP
  const submitHandlerOtp = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login-otp`, {
        email: input.email,
        otp: input.otp,
        role: input.role,
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Reset Password
  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
        email: input.email,
        otp: input.otp,
        newPassword: input.newPassword,
        role: input.role, // Added role to match backend expectation
      }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        toast.success("Password reset successfully! Please login.");
        setInput({
          email: "",
          password: "",
          role: input.role,
          otp: "",
          newPassword: "",
          stage: "password",
        }); // Reset form and return to password stage
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-6xl flex bg-white shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex flex-col justify-center items-center relative">
            <img src={personImage} alt="Login Illustration" className="w-3/4 h-auto object-cover rounded-xl shadow-lg" />
            <div className="mt-6 text-center text-white">
              <h2 className="text-2xl font-bold">Unlock Your Potential</h2>
              <div className="flex justify-center space-x-4 mt-6">
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition">5-Day Interview Prep</div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition">Mock Interviews</div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg shadow-md hover:bg-opacity-50 transition">100-Day Coding Sprint</div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome back</h1>
            <p className="text-center text-gray-600 mb-6">Access your account</p>

            <Tabs value={input.role} onValueChange={(value) => setInput({ ...input, role: value })} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="candidate" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-700">
                  <User className="w-4 h-4 mr-2" /> Candidate
                </TabsTrigger>
                <TabsTrigger value="recruiter" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2" /> Recruiter
                </TabsTrigger>
              </TabsList>

              {input.stage === "password" && (
                <form onSubmit={submitHandlerPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="you@example.com"
                      className="mt-1 w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to="#"
                      onClick={() => setInput({ ...input, stage: "otp" })}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Login via OTP
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={input.password}
                      onChange={changeEventHandler}
                      placeholder="••••••••"
                      className="mt-1 w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to="#"
                      onClick={() => setInput({ ...input, stage: "forgot" })}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gray-300 text-gray-700 rounded-full py-2 hover:bg-gray-400 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                      Create one now
                    </Link>
                  </p>
                </form>
              )}

              {input.stage === "otp" && (
                <form onSubmit={submitHandlerOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="you@example.com"
                      className="mt-1 w-full border-gray-300 rounded-md"
                      required
                      disabled
                    />
                  </div>
                  <Button
                    onClick={requestOtpHandler}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</>
                    ) : (
                      "Request OTP"
                    )}
                  </Button>
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="flex items-center gap-2 text-gray-700">
                      <Key className="h-4 w-4" /> OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      name="otp"
                      value={input.otp}
                      onChange={changeEventHandler}
                      placeholder="Enter OTP"
                      className="mt-1 w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gray-300 text-gray-700 rounded-full py-2 hover:bg-gray-400 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                    ) : (
                      "Login with OTP"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setInput({ ...input, stage: "password", otp: "" })}
                    className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 mt-2"
                  >
                    Back to Login
                  </Button>
                </form>
              )}

              {input.stage === "forgot" && (
                <form onSubmit={requestOtpHandler} className="space-y-4">
                  <div className="text-yellow-600 flex items-center">
                    <Lock className="mr-2" />
                    <p className="text-sm">Forgot Password?</p>
                  </div>
                  <p className="text-gray-600 text-sm">Create a new password to log into your account.</p>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="you@example.com"
                      className="mt-1 w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gray-300 text-gray-700 rounded-full py-2 hover:bg-gray-400 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setInput({ ...input, stage: "password" })}
                    className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 mt-2"
                  >
                    ← Back to Login
                  </Button>
                </form>
              )}

              {input.stage === "forgot-otp" && (
                <form onSubmit={resetPasswordHandler} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="flex items-center gap-2 text-gray-700">
                      <Key className="h-4 w-4" /> OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      name="otp"
                      value={input.otp}
                      onChange={changeEventHandler}
                      placeholder="Enter OTP"
                      className="mt-1 w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4" /> New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={input.newPassword}
                      onChange={changeEventHandler}
                      placeholder="••••••••"
                      className="mt-1 w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gray-300 text-gray-700 rounded-full py-2 hover:bg-gray-400 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setInput({ ...input, stage: "forgot" })}
                    className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 mt-2"
                  >
                    ← Back to Forgot
                  </Button>
                </form>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;