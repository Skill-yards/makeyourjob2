

import { useState, useEffect } from 'react';
import { Button } from './../ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  // Reset animation state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 100);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4 py-12">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Animated 404 Text */}
        <div className="relative mb-8 sm:mb-12 w-full">
          <div className="select-none pointer-events-none">
            <h1 
              className={`text-8xl sm:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${
                isAnimating ? "animate-pulse" : ""
              }`}
            >
              404
            </h1>
            <div className="absolute -bottom-4 w-full flex justify-center">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Page not found</h2>
          <p className="text-slate-600">Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.</p>
          
          {/* Illustration */}
          <div className="relative py-6 sm:py-8">
            <svg 
              viewBox="0 0 200 100" 
              className="w-full h-auto max-w-md mx-auto"
              aria-hidden="true"
            >
              <path 
                d="M10,90 Q50,30 90,90 T170,90" 
                fill="none" 
                stroke="#e0e7ff" 
                strokeWidth="2"
              />
              <circle 
                cx={`${isAnimating ? '30' : '150'}`} 
                cy="90" 
                r="7" 
                fill="#818cf8"
                className="transition-all duration-1000"
              />
              <path 
                d="M85,40 l15,15 l15,-15" 
                fill="none" 
                stroke="#c7d2fe" 
                strokeWidth="2"
              />
              <rect 
                x="95" 
                y="70" 
                width="10" 
                height={`${isAnimating ? '15' : '5'}`} 
                fill="#a5b4fc"
                className="transition-all duration-1000" 
              />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pb-6">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-full shadow-md px-6"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-slate-200 hover:bg-slate-50 rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="ghost"
              className="text-slate-700 hover:bg-slate-100 rounded-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-md mt-6 sm:mt-10">
          <div className="bg-white rounded-full shadow-md border border-slate-200 flex items-center px-4 py-2">
            <Search className="h-5 w-5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search for content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
            />
            <Button 
              disabled={!searchQuery.trim()}
              size="sm"
              className={`rounded-full px-4 ${
                !searchQuery.trim() 
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
              }`}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-slate-500 flex items-center">
          <div className="w-10 h-px bg-slate-200 mr-3"></div>
          Need help? <a href="/contact" className="ml-1 text-violet-600 hover:underline">Contact support</a>
          <div className="w-10 h-px bg-slate-200 ml-3"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;