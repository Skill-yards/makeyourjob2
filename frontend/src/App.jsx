import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';

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

import Layout from "./utils/Layout";

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>
  },
  {
    path: '/login',
    element: <Layout><Login /></Layout>
  },
  {
    path: '/signup',
    element: <Layout><Signup /></Layout>
  },
  {
    path: "/jobs",
    element: <Layout><Jobs /></Layout>
  },
  {
    path: "/jobs/:id",
    element: <Layout><JobDescription /></Layout>
  },
  {
    path: "/browse",
    element: <Layout><Browse /></Layout>
  },
  {
    path: "/contact",
    element: <Layout><ContactUs/></Layout>
  },
  {
    path: "/privacy",
    element: <Layout><PrivacyPolicy/></Layout>
  },
  {
    path: "/terms",
    element: <Layout><TermsAndConditions/></Layout>
  },
  {
    path: "/profile",
    element: <Layout><Profile /></Layout>
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
   <div>
    
     <Suspense fallback={<div className="flex justify-center items-center text-3xl  h-screen"><div className='w-30 h-10 mt-2 bg-transparent'>
      <img src="../../../public/logo-removebg-preview.png"  alt="Logo" className="w-full h-full bg-transparent object-contain"></img>
      </div>....
      </div>}>
      <RouterProvider router={appRouter} />
     
    </Suspense>
   </div>
  );
}

export default App;