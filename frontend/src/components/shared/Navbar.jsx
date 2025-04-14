import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

// Lucide Icons
import { LogOut, User2, Briefcase, Menu, X, Home, Search, Building, ChevronDown } from 'lucide-react'

// UI Components
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    // Check if a link is active
    const isActive = (path) => {
        return location.pathname === path ? true : false;
    };

    // Navigation links based on user role
    const getNavLinks = () => {
        if (user && user.role === 'recruiter') {
            return [
            ];
        }
        return [
            { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
            { name: 'Jobs', path: '/jobs', icon: <Briefcase className="h-4 w-4" /> },
            { name: 'Browse', path: '/browse', icon: <Search className="h-4 w-4" /> }
        ];
    };

    // Get user initials for avatar fallback
    const getUserInitials = () => {
        if (!user || !user.firstname) return "U";
        return user.firstname.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 dark:bg-gray-950/95 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
        
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className='w-30 h-10 mt-2 bg-transparent'>
                                <img src="../../../public/logo-removebg-preview.png" alt="Logo" className="w-full h-full bg-transparent object-contain" />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {getNavLinks().map((link, index) => (
                            <Link key={index} to={link.path}>
                                <Button
                                    variant={isActive(link.path) ? "default" : "ghost"}
                                    className={`h-9 px-4 flex items-center gap-2 ${isActive(link.path) ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400" : ""}`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Button>
                            </Link>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="font-medium">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 font-medium">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-9 px-2 flex items-center space-x-2">
                                        <Avatar className="h-8 w-8 border border-gray-200">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.firstname || "User"} />
                                            <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                                                {getUserInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:inline text-sm font-medium">{user?.firstname?.split(' ')[0]}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-80 p-4">
                                    <div className="flex gap-3 items-start mb-4">
                                        <Avatar className="h-10 w-10 border border-gray-200">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.firstname || "User"} />
                                            <AvatarFallback className="bg-purple-100 text-purple-700">
                                                {getUserInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h4 className="font-semibold">{user?.firstname}</h4>
                                            <div className="flex items-center">
                                                <Badge variant="outline" className="text-xs px-2 capitalize bg-purple-50 text-purple-700 border-purple-200">
                                                    {user?.role}
                                                </Badge>
                                            </div>
                                            {user?.profile?.bio && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">{user?.profile?.bio}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator className="my-3" />

                                    <nav className="space-y-1">
                                        {user && user.role === 'candidate' && (
                                            <Link to="/profile" className="flex items-center h-9 px-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                <User2 className="mr-2 h-4 w-4 text-gray-500" />
                                                <span>View Profile</span>
                                            </Link>
                                        )}

                                        {user && user.role === 'recruiter' && (
                                            <Link to="/admin/profile" className="flex items-center h-9 px-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                <User2 className="mr-2 h-4 w-4 text-gray-500" />
                                                <span>View Profile</span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={logoutHandler}
                                            className="flex w-full items-center h-9 px-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    </nav>
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:max-w-xs">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                                            <Briefcase className="h-6 w-6 text-purple-600" />
                                            <span className="text-lg font-bold tracking-tight">
                                                Job<span className="text-orange-600">Portal</span>
                                            </span>
                                        </Link>
                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    {/* Mobile Menu Links */}
                                    <nav className="flex flex-col space-y-1">
                                        {getNavLinks().map((link, index) => (
                                            <Link
                                                key={index}
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center py-3 px-3 rounded-md ${isActive(link.path)
                                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    }`}
                                            >
                                                {link.icon}
                                                <span className="ml-2 font-medium">{link.name}</span>
                                            </Link>
                                        ))}
                                    </nav>

                                    <Separator className="my-4" />

                                    {/* Mobile Login/Signup or User Info */}
                                    {!user ? (
                                        <div className="flex flex-col space-y-2 mt-auto">
                                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full">
                                                    Login
                                                </Button>
                                            </Link>
                                            <Link to="/signup" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                                    Signup
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="mt-auto">
                                            <div className="flex items-start gap-3 p-3 mb-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                <Avatar className="h-10 w-10 border border-gray-200">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.firstname || "User"} />
                                                    <AvatarFallback className="bg-purple-100 text-purple-700">
                                                        {getUserInitials()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user?.firstname}</p>
                                                    <Badge variant="outline" className="mt-1 text-xs capitalize">
                                                        {user?.role}
                                                    </Badge>
                                                </div>
                                            </div>


                                            <Link
                                                to="/profile"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center py-3 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <User2 className="h-4 w-4 text-gray-500" />
                                                <span className="ml-2">View Profile</span>
                                            </Link>


                                            <button
                                                onClick={() => {
                                                    logoutHandler();
                                                    setIsOpen(false);
                                                }}
                                                className="flex w-full items-center py-3 px-3 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span className="ml-2">Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;