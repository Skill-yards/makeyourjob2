
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Left Section - Text */}
          <div className="md:w-3/5">
            <div className="mb-6">
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-lg text-gray-600 mt-2">
                Every human or organization has three levels of openness: Public, Personal, and Private. We believe in your right to privacy.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p className="text-gray-700">
                At MakeYourJobs.com, we recognize that privacy is important. This Privacy Policy applies to the use of the website, its contents, and all the services offered by MakeYourJobs.com.
              </p>
              <p className="text-gray-700">
                This policy describes how FLIVE Consulting Private Limited, the parent company of MakeYourJobs.com, handles your data when you use the Platform.
              </p>

              <h2 className="text-2xl font-semibold">Scope</h2>
              <p className="text-gray-700">
                This policy applies to Make Your Jobs’ contents, products, services, and websites. It does not apply to third-party services that we do not control.
              </p>

              <h2 className="text-2xl font-semibold">Definitions</h2>
              <p className="text-gray-700">
                <strong>Opportunities:</strong> Public and private competitions, quizzes, hackathons, events, scholarships, jobs, and more hosted on the Platform.
              </p>
              <p className="text-gray-700">
                <strong>Clients:</strong> Companies, institutes, and organizations using the Platform to host events and hire candidates.
              </p>
              <p className="text-gray-700">
                <strong>Participants:</strong> Individuals who register and participate in opportunities on the Platform.
              </p>

              <h2 className="text-2xl font-semibold">Information Collection and Use</h2>
              <p className="text-gray-700">
                We collect personal information such as name, email, contact details, and professional information. Additionally, we collect device and tracking information, assessment data, and marketing preferences.
              </p>
              <p className="text-gray-700">
                We use this data to provide personalized experiences, facilitate participation in opportunities, and improve our services.
              </p>

              <h2 className="text-2xl font-semibold">Data Sharing</h2>
              <p className="text-gray-700">
                We do not sell your personal data. However, we may share necessary details with clients for opportunity-related processes and third-party service providers for essential platform operations.
              </p>

              <h2 className="text-2xl font-semibold">Data Security</h2>
              <p className="text-gray-700">
                We implement security measures to protect your data, including encryption and restricted access policies.
              </p>

              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p className="text-gray-700">
                You have the right to access, update, or delete your data. For any inquiries, contact us at{" "}
                <a href="mailto:help@makeyourjobs.com" className="text-blue-500 underline">
                  help@makeyourjobs.com
                </a>.
              </p>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="hidden md:block md:w-2/5">
            <div className="flex justify-center">
              <img
                src="/Privacy policy-amico.png"
                alt="Privacy Illustration"
                className="w-full max-w-xs object-contain"
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
