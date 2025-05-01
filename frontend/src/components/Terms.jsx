import React from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import TermsImage from "../../public/Accept terms-rafiki.png";

const TermsAndConditions = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIzIDAgMi4xOTguOTY5IDIuMTk4IDIuMTk4IDAgMS4yMzMtLjk2OCAyLjItMi4xOTggMi4yLTEuMjMzIDAtMi4yLTAuOTY3LTIuMi0yLjIgMC0xLjIyOS45NjctMi4xOTggMi4yLTIuMTk4em0tOC4xOTggMTkuOGMtMS4yMyAwLTIuMi45NjktMi4yIDIuMiAwIDEuMjI5Ljk3IDIuMTk4IDIuMiAyLjE5OCAxLjIzIDAgMi4xOTgtLjk2OSAyLjE5OC0yLjE5OCAwLTEuMjMxLS45NjgtMi4yLTIuMTk4LTIuMnptLTYuNi05QzE5Ljk3IDI4LjggMTkgMjkuNzY5IDE5IDMxYzAgMS4yMzMuOTY5IDIuMiAyLjIwMiAyLjIgMS4yMzEgMCAyLjE5OC0wLjk2NyAyLjE5OC0yLjIgMC0xLjIzMS0uOTY3LTIuMi0yLjE5OC0yLjJ6TTM2IDQwLjhjMS4yMyAwIDIuMTk4Ljk2OSAyLjE5OCAyLjIgMCAxLjIzLS45NjggMi4xOTgtMi4xOTggMi4xOTgtMS4yMzMgMC0yLjItMC45NjktMi4yLTIuMTk4IDAtMS4yMzEuOTY3LTIuMiAyLjItMi4yek0yMS4yIDI0LjhjMi40NjEgMCA0LjQtMS45MzggNC40LTQuMzk4IDAtMi40NjItMS45MzktNC40LTQuNC00LjQtMi40NiAwLTQuMzk4IDEuOTM4LTQuMzk4IDQuNDAgMCAyLjQ2IDEuOTM4IDQuMzk4IDQuMzk4IDQuMzk4em0wLTIuMmMxLjIzMSAwIDIuMi0uOTY3IDIuMi0yLjE5OCAwLTEuMjMtLjk2OS0yLjItMi4yLTIuMi0xLjIzIDAtMi4xOTguOTctMi4xOTggMi4yIDAgMS4yMzEuOTY3IDIuMTk4IDIuMTk4IDIuMTk4em0xNC44IDE3LjZjLTIuNDYyIDAtNC40IDEuOTM5LTQuNCA0LjQgMCAyLjQ2IDEuOTM4IDQuMzk4IDQuNCA0LjM5OCAyLjQ2IDAgNC4zOTgtMS45MzggNC4zOTgtNC4zOTkgMC0yLjQ2LTEuOTM4LTQuMzk5LTQuMzk4LTQuMzk5em0wIDIuMmMxLjIzIDAgMi4xOTguOTY3IDIuMTk4IDIuMiAwIDEuMjMtLjk2OCAyLjE5OC0yLjE5OCAyLjE5OC0xLjIzMyAwLTIuMi0wLjk2OS0yLjItMi4xOTggMC0xLjIzMy45NjctMi4yIDIuMi0yLjJ6bS0xNC44LTEzLjJjLTIuNDYgMC00LjM5OCAxLjk0LTQuMzk4IDQuNCAwIDIuNDYyIDEuOTM4IDQuNCA0LjM5OCA0LjQgMi40NjEgMCA0LjQtMS45MzggNC40LTQuNCAwLTIuNDYtMS45MzktNC40LTQuNC00LjR6bTAgMi4yYzEuMjMxIDAgMi4yLjk2OSAyLjIgMi4yIDAgMS4yMzEtLjk2OSAyLjItMi4yIDIuMi0xLjIzIDAtMi4xOTgtMC45NjktMi4xOTgtMi4yIDAtMS4yMzEuOTY3LTIuMiAyLjE5OC0yLjJ6bTE0LjgtMTEuMDAxYy0yLjQ2MSAwLTQuMzk5IDEuOTM5LTQuMzk5IDQuNCAwIDIuNDYyIDEuOTM4IDQuNCA0LjM5OSA0LjQgMi40NiAwIDQuMzk4LTEuOTM4IDQuMzk4LTQuNCAwLTIuNDYxLTEuOTM4LTQuNC00LjM5OC00LjR6bTAgMi4yYzEuMjMgMCAyLjE5OC45NyAyLjE5OCAyLjIgMCAxLjIzMS0uOTY4IDIuMi0yLjE5OCAyLjItMS4yMzMgMC0yLjItMC45NjktMi4yLTIuMiAwLTEuMjMuOTY3LTIuMiAyLjItMi4yeiIgZmlsbD0iI0ZGRiIvPjwvZz48L3N2Zz4=')] bg-repeat"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold">Terms & Conditions</h1>
              <p className="mt-4 text-xl text-indigo-100 max-w-2xl">
                Thank you for choosing Make Your Jobs. Please review our terms carefully before using our services.
              </p>
            </div>
            <div className="hidden lg:block">
              <img
                src={TermsImage}
                alt="Terms Illustration"
                className="w-72 h-72 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative -mt-10">
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="font-bold">1</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Acceptance of Terms</h2>
              </div>
              <div className="pl-11">
                <p className="text-gray-700 leading-relaxed">
                  By subscribing to or using any of our Services, you acknowledge that you have read,
                  understood, and agreed to these Terms. If you do not agree, please do not use our
                  Services.
                </p>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  "You," "User," or "Visitor" refers to the individual accessing the Website and its
                  Services. <br />
                  "We," "Us," or "Our" refers to Make Your Jobs and its affiliates.
                </p>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  We may update these Terms at any time. Continued use of our Services after changes
                  are posted constitutes your acceptance of the revised Terms.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="font-bold">2</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Using Our Services</h2>
              </div>
              <div className="pl-11">
                <p className="text-gray-700 leading-relaxed">
                  You may access our Services only if you are of legal age to enter a binding contract.
                  You accept these Terms by:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Clicking "Agree" where prompted.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Using our Services, which implies acceptance of these Terms.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="font-bold">3</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Modifications to Services</h2>
              </div>
              <div className="pl-11">
                <p className="text-gray-700 leading-relaxed">
                  Make Your Jobs reserves the right to:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Modify, suspend, or discontinue any part of the Services without notice.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Change the Terms, with updates posted on the website.</span>
                  </li>
                </ul>
                <div className="bg-indigo-50 rounded-lg p-4 mt-4 border-l-4 border-indigo-400">
                  <p className="text-indigo-800">
                    Your continued use after changes are made implies acceptance of the updated Terms.
                  </p>
                </div>
              </div>
            </div>

            {/* More sections would go here */}

            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="font-bold">10</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Reporting Abuse</h2>
              </div>
              <div className="pl-11">
                <p className="text-gray-700 leading-relaxed">
                  Users are responsible for their content on the website. We do not endorse or verify
                  user-generated content. If you encounter any violations or abuse, please report them to:
                </p>
                <div className="mt-4 bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a
                      href="mailto:reportabuse@makeyourjobs.com"
                      className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                    >
                      info@makeyourjobs.com
                    </a>
                  </div>
                  <button className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-colors">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 text-center">
              <p className="text-gray-800 font-bold text-lg">
                By using our Services, you agree to these Terms.
              </p>
              <p className="text-indigo-600 font-medium mt-2">
                Thank you for being a part of Make Your Jobs!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
