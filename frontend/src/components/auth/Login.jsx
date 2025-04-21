import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setLoading, setUser } from '@/redux/authSlice'

// Lucide Icons
import { Loader2, LogIn, Mail, Lock, User, Building } from 'lucide-react'

// UI Components
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useCookies } from 'react-cookie'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "Employees", // Default role
    });

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
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
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md mx-auto shadow-lg">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <LogIn className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={input.email}
                                        onChange={changeEventHandler}
                                        placeholder="you@example.com"
                                        className="pl-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={input.password}
                                        onChange={changeEventHandler}
                                        placeholder="••••••••"
                                        className="pl-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    I am a
                                </Label>
                                <RadioGroup 
                                    defaultValue="student" 
                                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                                    value={input.role}
                                    onValueChange={(value) => setInput({...input, role: value})}
                                >
                                    <div className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <RadioGroupItem value="Employees" id="Employees" name="role" />
                                        <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer">
                                            <User className="h-4 w-4" />
                                            Employees
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <RadioGroupItem value="recruiter" id="recruiter" name="role" />
                                        <Label htmlFor="recruiter" className="flex items-center gap-2 cursor-pointer">
                                            <Building className="h-4 w-4" />
                                            Recruiter
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full mt-6"
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
                        </form>
                    </CardContent>
                    <Separator className="my-1" />
                    <CardFooter className="flex flex-col space-y-4 mt-4">
                        <div className="text-sm text-center w-full">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-primary hover:underline">
                                Create one now
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Login