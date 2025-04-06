import { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    file: '',
  });

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);

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

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const sendOtpHandler = async () => {
    try {
      if (!input.email || !input.fullname || !input.role) {
        return toast.error('Please enter email, full name, and role to receive OTP');
      }

      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, {
        email: input.email,
        fullname: input.fullname,
        role: input.role,
      });

      if (res.data.success) {
        setIsOtpSent(true);
        setTimer(120);
        toast.success('OTP sent to your email!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resendOtpHendler = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/reset-otp/otp`, {
        email: input.email,
      });

      if (res.data.success) {
        toast.success('OTP resent successfully');
        setTimer(120);
      } else {
        toast.error('Unable to resend OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP resend failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const verifyOtpHandler = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/verify/otp`, {
        email: input.email,
        otp,
      });

      if (res.data.success) {
        setIsOtpVerified(true);
        toast.success('OTP verified successfully');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) return toast.error('Please verify OTP before signing up!');

    const formData = new FormData();
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('isOtpVerified', true);
    if (input.file) formData.append('file', input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <div className='flex justify-center items-center min-h-screen bg-gray-50 px-4'>
        <form
          onSubmit={submitHandler}
          className='w-full max-w-lg bg-white p-8 shadow-xl rounded-2xl border'
        >
          <h1 className='text-2xl font-bold mb-6 text-center'>Create an Account</h1>

          <div className='space-y-4'>
            <div>
              <Label>Full Name</Label>
              <Input type='text' name='fullname' value={input.fullname} onChange={changeEventHandler} placeholder='Patel' />
            </div>

            <div>
              <Label>Email</Label>
              <Input type='email' name='email' value={input.email} onChange={changeEventHandler} placeholder='patel@gmail.com' />
            </div>

            <div className='flex gap-4'>
              <div className='flex items-center space-x-2'>
                <Input type='radio' name='role' value='Employees' checked={input.role === 'Employees'} onChange={changeEventHandler} />
                <Label>Employees</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Input type='radio' name='role' value='recruiter' checked={input.role === 'recruiter'} onChange={changeEventHandler} />
                <Label>Recruiter</Label>
              </div>
            </div>

            {!isOtpVerified && (
              <>
                {!isOtpSent ? (
                  <Button type='button' onClick={sendOtpHandler}>
                    Send OTP
                  </Button>
                ) : (
                  <div className='flex items-center gap-4'>
                    <Button
                      type='button'
                      onClick={resendOtpHendler}
                      disabled={timer > 0}
                      className={`${timer > 0 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : ''}`}
                    >
                      Resend OTP
                    </Button>
                    {timer > 0 && (
                      <span className='text-sm text-muted-foreground'>Resend in {formatTime(timer)}</span>
                    )}
                  </div>
                )}

                {isOtpSent && (
                  <div>
                    <Label>Enter OTP</Label>
                    <Input
                      type='text'
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder='Enter OTP'
                    />
                    <Button type='button' onClick={verifyOtpHandler} className='mt-2'>
                      Verify OTP
                    </Button>
                  </div>
                )}
              </>
            )}

            <div>
              <Label>Phone Number</Label>
              <Input type='text' name='phoneNumber' value={input.phoneNumber} onChange={changeEventHandler} placeholder='8080808080' />
            </div>

            <div>
              <Label>Password</Label>
              <Input type='password' name='password' value={input.password} onChange={changeEventHandler} placeholder='********' />
            </div>

            <div className='flex flex-col gap-1'>
              <Label>Profile Image</Label>
              <Input accept='image/*' type='file' onChange={changeFileHandler} />
            </div>

            {loading ? (
              <Button className='w-full' disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
              </Button>
            ) : (
              <Button type='submit' className='w-full' disabled={!isOtpVerified}>
                Sign Up
              </Button>
            )}

            <p className='text-center text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-600 font-medium'>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
