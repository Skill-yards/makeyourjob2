import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, LogIn, Mail, Lock, User, Briefcase } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import Navbar from "../shared/Navbar";
import personImage from "../../../public/Employees.png"; // Update this path

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "candidate", // Default role
  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-6xl flex bg-white shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300">
          {/* Left Section with Image and Text */}
          <div className="w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex flex-col justify-center items-center relative">
            <img
              src={personImage}
              alt="Login Illustration"
              className="w-3/4 h-auto object-cover rounded-xl shadow-lg"
            />
            <div className="mt-6 text-center text-white">
              <h2 className="text-2xl font-bold">Unlock Your Potential</h2>
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
            {/* Background Network */}
            <div className="absolute inset-0 opacity-15">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 "
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Right Section with Tabs and Form */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Welcome back
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Enter your credentials to access your account
            </p>

            {/* Tabs */}
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

              {/* Employees Form */}
              <TabsContent value="candidate">
                <form onSubmit={submitHandler} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="you@example.com"
                      className="pl-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={input.password}
                      onChange={changeEventHandler}
                      placeholder="••••••••"
                      className="pl-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    {`Don't have an account?`}
                    <Link
                      to="/signup"
                      className="font-medium text-blue-600 hover:underline transition-colors"
                    >
                      Create one now
                    </Link>
                  </p>
                </form>
              </TabsContent>

              {/* Recruiter Form */}
              <TabsContent value="recruiter">
                <form onSubmit={submitHandler} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="hr@techcorp.com"
                      className="pl-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={input.password}
                      onChange={changeEventHandler}
                      placeholder="••••••••"
                      className="pl-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    {`Don't have an account?`}
                    <Link
                      to="/signup"
                      className="font-medium text-blue-600 hover:underline transition-colors"
                    >
                      Create one now
                    </Link>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;