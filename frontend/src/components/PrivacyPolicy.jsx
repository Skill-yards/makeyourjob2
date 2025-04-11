import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="flex flex-col md:flex-row items-start gap-12 max-w-7xl mx-auto">
          {/* Left Section - Text */}
          <div className="md:w-3/5">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-4 leading-relaxed">
                Every human or organization has three levels of openness: Public, Personal, and Private. We believe in your right to privacy.
              </p>
              <div className="w-20 h-1 bg-yellow-400 mt-4 rounded-full"></div>
            </div>

            <div className="space-y-10">
              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Introduction</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  At MakeYourJobs.com, we recognize that privacy is important. This Privacy Policy applies to the use of the website, its contents, and all the services offered by MakeYourJobs.com.
                </p>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  This policy describes how FLIVE Consulting Private Limited, the parent company of MakeYourJobs.com, handles your data when you use the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Scope</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  This policy applies to Make Your Jobs’ contents, products, services, and websites. It does not apply to third-party services that we do not control.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Definitions</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  <strong className="font-medium text-gray-800">Opportunities:</strong> Public and private competitions, quizzes, hackathons, events, scholarships, jobs, and more hosted on the Platform.
                </p>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  <strong className="font-medium text-gray-800">Clients:</strong> Companies, institutes, and organizations using the Platform to host events and hire candidates.
                </p>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  <strong className="font-medium text-gray-800">Participants:</strong> Individuals who register and participate in opportunities on the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Information Collection and Use</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  We collect personal information such as name, email, contact details, and professional information. Additionally, we collect device and tracking information, assessment data, and marketing preferences.
                </p>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  We use this data to provide personalized experiences, facilitate participation in opportunities, and improve our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Data Sharing</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  We do not sell your personal data. However, we may share necessary details with clients for opportunity-related processes and third-party service providers for essential platform operations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Data Security</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  We implement security measures to protect your data, including encryption and restricted access policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Your Rights</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  You have the right to access, update, or delete your data. For any inquiries, contact us at{" "}
                  <a href="mailto:help@makeyourjobs.com" className="text-indigo-600 underline hover:text-indigo-800 transition-colors duration-200">
                    help@makeyourjobs.com
                  </a>.
                </p>
              </section>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="hidden md:block md:w-2/5">
            <div className="flex justify-center sticky top-10">
              <img
                src="/Privacy policy-amico.png"
                alt="Privacy Illustration"
                className="w-full max-w-sm object-contain  transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
