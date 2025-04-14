import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Shared Components

import ProtectedRoute from './components/admin/ProtectedRoute';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';

// Lazy-loaded Components
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const Jobs = lazy(() => import('./components/Jobs'));
const Browse = lazy(() => import('./components/Browse'));
const Profile = lazy(() => import('./components/Profile'));
const JobDescription = lazy(() => import('./components/JobDescription'));
const ContactUs = lazy(() => import('./components/Contact'));
const TermsAndConditions = lazy(() => import('./components/Terms'));
const AdminSingleWithApply = lazy(() => import('./components/admin/AdminSingleJobWithApply'));
const CompanyJobApplicants = lazy(() => import('./components/admin/CompanyJobApplicants'));
// const CompanyJobList = lazy(() => import('./components/admin/CompanyJobList'));
const JobSetup = lazy(() => import('./components/admin/JobSetup'));
const AdminProfile = lazy(() => import('./components/admin/AdminProfile'));


// Admin Lazy-loaded Components
const Companies = lazy(() => import('./components/admin/Companies'));
const CompanyCreate = lazy(() => import('./components/admin/CompanyCreate'));
const CompanySetup = lazy(() => import('./components/admin/CompanySetup'));
const AdminJobs = lazy(() => import('./components/admin/AdminJobs'));
const PostJob = lazy(() => import('./components/admin/PostJob'));
const Applicants = lazy(() => import('./components/admin/Applicants'));

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/jobs/:id",
    element: <JobDescription />
  },
  { 
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/contact",
    element: <ContactUs/>
  },

  {
    path: "/privacy",
    element: <PrivacyPolicy/>
  },
  {
    path: "/terms",
    element: <TermsAndConditions/>
  },
  
  {
    path: "/profile",
    element: <Profile />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/profile",
    element: <ProtectedRoute><AdminProfile/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element: <ProtectedRoute><CompanyJobApplicants/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id/update",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id",
    element:<ProtectedRoute><AdminSingleWithApply /></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/update",
    element:<ProtectedRoute><JobSetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
])

function App() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center text-3xl  h-screen"><div className='w-30 h-10 mt-2 bg-transparent'>
      <img src="../../../public/logo-removebg-preview.png"  alt="Logo" className="w-full h-full bg-transparent object-contain"></img>
      </div>....
      </div>}>
      <RouterProvider router={appRouter} />
    </Suspense>
  );
}

export default App;