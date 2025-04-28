import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mt-4 max-w-lg">
              Every human or organization has three levels of openness: Public,
              Personal, and Private. We believe in your right to privacy.
            </p>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <img
              src="/Privacy policy-amico.png"
              alt="Privacy Illustration"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar - Quick Navigation */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Navigation
                </h3>
                <ul className="space-y-2">
                  {[
                    "Introduction",
                    "Scope",
                    "Definitions",
                    "Information Collection",
                    "Data Sharing",
                    "Data Security",
                    "Your Rights",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center group"
                      >
                        <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-md font-semibold text-blue-800">
                    Need Help?
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    For any privacy-related questions, contact us at:
                  </p>
                  <a
                    href="mailto:help@makeyourjobs.com"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 block"
                  >
                    help@makeyourjobs.com
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <section id="introduction">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  Introduction
                </h2>
                <div className="text-gray-700 space-y-4 pl-11">
                  <p>
                    At MakeYourJobs.com, we recognize that privacy is important.
                    This Privacy Policy applies to the use of the website, its
                    contents, and all the services offered by MakeYourJobs.com.
                  </p>
                  <p>
                    This policy describes how FLIVE Consulting Private Limited,
                    the parent company of MakeYourJobs.com, handles your data
                    when you use the Platform.
                  </p>
                </div>
              </section>
              <section id="scope">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center text-sm">
                    2
                  </span>
                  Scope
                </h2>
                <div className="text-gray-700 pl-11">
                  <p>
                    This policy applies to Make Your Jobs' contents, products,
                    services, and websites. It does not apply to third-party
                    services that we do not control.
                  </p>
                </div>
              </section>
              <section id="definitions">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  Definitions
                </h2>
                <div className="text-gray-700 space-y-4 pl-11">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="font-medium">Opportunities</p>
                    <p className="text-sm">
                      Public and private competitions, quizzes, hackathons,
                      events, scholarships, jobs, and more hosted on the
                      Platform.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="font-medium">Clients</p>
                    <p className="text-sm">
                      Companies, institutes, and organizations using the
                      Platform to host events and hire candidates.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="font-medium">Participants</p>
                    <p className="text-sm">
                      Individuals who register and participate in opportunities
                      on the Platform.
                    </p>
                  </div>
                </div>
              </section>
              <section id="information-collection">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center text-sm">
                    4
                  </span>
                  Information Collection and Use
                </h2>
                <div className="text-gray-700 space-y-4 pl-11">
                  <p>
                    We collect personal information such as name, email, contact
                    details, and professional information. Additionally, we
                    collect device and tracking information, assessment data,
                    and marketing preferences.
                  </p>
                  <p>
                    We use this data to provide personalized experiences,
                    facilitate participation in opportunities, and improve our
                    services.
                  </p>
                </div>
              </section>

              <section id="data-sharing">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center text-sm">
                    5
                  </span>
                  Data Sharing
                </h2>
                <div className="text-gray-700 pl-11">
                  <p>
                    We do not sell your personal data. However, we may share
                    necessary details with clients for opportunity-related
                    processes and third-party service providers for essential
                    platform operations.
                  </p>
                </div>
              </section>

              <section id="data-security">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center text-sm">
                    6
                  </span>
                  Data Security
                </h2>
                <div className="text-gray-700 pl-11">
                  <p>
                    We implement security measures to protect your data,
                    including encryption and restricted access policies.
                  </p>
                </div>
              </section>

              <section id="your-rights">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center text-sm">
                    7
                  </span>
                  Your Rights
                </h2>
                <div className="text-gray-700 pl-11">
                  <p>
                    You have the right to access, update, or delete your data.
                    For any inquiries, contact us at{" "}
                    <a
                      href="mailto:help@makeyourjobs.com"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      help@makeyourjobs.com
                    </a>
                    .
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Your Privacy Matters to Us
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            If you have any questions about our privacy practices, please don't
            hesitate to reach out to our team.
          </p>
          <a
            href="mailto:help@makeyourjobs.com"
            className="inline-block bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            Contact Our Privacy Team
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
