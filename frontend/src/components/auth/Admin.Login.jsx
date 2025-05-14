import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAdmin } from "@/redux/adminSlice";
import { Loader2, Lock } from "lucide-react";
import axios from "@/utils/axiosConfig"; // Use configured axios
import { USER_API_END_POINT } from "@/utils/constant";
import personImage from "../../../public/Employees.png";

const AdminLogin = () => {
  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdminFormData({
      ...adminFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/admin-login`,
        {
          email: adminFormData.email,
          password: adminFormData.password,
          role: "admin",
        },
        {
          withCredentials: true, // Ensure cookies are sent/received
        }
      );
      console.log("Login Response:", res.data);
      if (res.data.success) {
        dispatch(setAdmin(res.data.user));
        toast.success(res.data.message || "Logged in successfully!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error.response || error);
      toast.error(error.response?.data?.message || "Invalid credentials!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="hidden md:block w-1/2 bg-gray-50 p-8">
            <img
              src={personImage}
              alt="Person working on a computer"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 bg-blue-600 p-8 flex flex-col justify-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-2">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Sign In to Admin Dashboard
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={adminFormData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={adminFormData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={adminFormData.rememberMe}
                    onCheckedChange={(checked) =>
                      setAdminFormData({ ...adminFormData, rememberMe: checked })
                    }
                  />
                  <Label htmlFor="rememberMe" className="ml-2 text-white">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/admin/forgot-password"
                  className="text-white hover:underline hover:text-orange-300"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>
            <p className="text-center text-white mt-4">
              Not registered yet?{" "}
              <Link to="/admin/register" className="underline hover:text-orange-300">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;