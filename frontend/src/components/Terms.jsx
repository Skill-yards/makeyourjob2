import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import TermsImage from "../../public/Accept terms-rafiki.png";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-blue-50 to-gray-50 text-gray-800">
        <div className="flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
          {/* Left Section - Text */}
          <div className="md:w-3/5">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Terms & Conditions
              </h1>
              <p className="text-base md:text-xl text-gray-600 mt-4 leading-relaxed">
                Welcome to Make Your Jobs! By using our products, software, services, and websites
                (collectively referred to as the "Services"), you agree to comply with the following
                Terms & Conditions. Please read them carefully before proceeding.
              </p>
              <div className="w-20 h-1 bg-yellow-400 mt-4 rounded-full"></div>
            </div>

            <div className="space-y-10">
              <section>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">1. Acceptance of Terms</h2>
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
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">2. Using Our Services</h2>
                <p className="text-gray-700 leading-relaxed">
                  You may access our Services only if you are of legal age to enter a binding contract.
                  You accept these Terms by:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                  <li>Clicking "Agree" where prompted.</li>
                  <li>Using our Services, which implies acceptance of these Terms.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">3. Modifications to Services</h2>
                <p className="text-gray-700 leading-relaxed">Make Your Jobs reserves the right to:</p>
                <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                  <li>Modify, suspend, or discontinue any part of the Services without notice.</li>
                  <li>Change the Terms, with updates posted on the website.</li>
                </ul>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Your continued use after changes are made implies acceptance of the updated Terms.
                </p>
              </section>

              {/* Example final section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">10. Reporting Abuse</h2>
                <p className="text-gray-700 leading-relaxed">
                  Users are responsible for their content on the website. We do not endorse or verify
                  user-generated content. If you encounter any violations or abuse, please report them
                  to{" "}
                  <a
                    href="mailto:reportabuse@makeyourjobs.com"
                    className="text-indigo-600 hover:text-indigo-800 underline transition-colors duration-200"
                  >
                    reportabuse@makeyourjobs.com
                  </a>
                  .
                </p>
              </section>

              <p className="text-gray-800 font-medium mt-8 bg-gray-100 p-4 rounded-lg shadow-inner">
                By using our Services, you agree to these Terms. Thank you for being a part of Make Your Jobs!
              </p>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="hidden md:block md:w-2/5">
            <div className="flex justify-center sticky top-10">
              <img
                src={TermsImage}
                alt="Terms Illustration"
                className="w-80 rounded-2xl  transform  transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;