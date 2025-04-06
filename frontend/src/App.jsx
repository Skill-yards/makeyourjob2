import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Shared Components

import ProtectedRoute from './components/admin/ProtectedRoute';

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
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));



// Admin Lazy-loaded Components
const Companies = lazy(() => import('./components/admin/Companies'));
const CompanyCreate = lazy(() => import('./components/admin/CompanyCreate'));
const CompanySetup = lazy(() => import('./components/admin/CompanySetup'));
const AdminJobs = lazy(() => import('./components/admin/AdminJobs'));
const PostJob = lazy(() => import('./components/admin/PostJob'));
const Applicants = lazy(() => import('./components/admin/Applicants'));

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/description/:id', element: <JobDescription /> },
  { path: '/browse', element: <Browse /> },
  { path: '/profile', element: <Profile /> },
  { path: '/contact', element: <ContactUs /> },
  { path: '/terms', element: <TermsAndConditions /> },
  { path: '/privacy', element: <PrivacyPolicy  /> },

  // Admin Routes
  { path: '/admin/companies', element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> },
  { path: '/admin/companies/:id', element: <ProtectedRoute><CompanySetup /></ProtectedRoute> },
  { path: '/admin/jobs', element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
  { path: '/admin/jobs/create', element: <ProtectedRoute><PostJob /></ProtectedRoute> },
  { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute><Applicants /></ProtectedRoute> },
]);

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
