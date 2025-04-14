
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import TermsImage from "../../public/Accept terms-rafiki.png"; // corrected import

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 text-gray-800">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Section - Text */}
          <div className="md:w-3/5">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
              <p className="text-base md:text-lg text-gray-600 mt-3 leading-relaxed">
                Welcome to Make Your Jobs! By using our products, software, services, and websites
                (collectively referred to as the "Services"), you agree to comply with the following
                Terms & Conditions. Please read them carefully before proceeding.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By subscribing to or using any of our Services, you acknowledge that you have read,
                  understood, and agreed to these Terms. If you do not agree, please do not use our
                  Services.
                </p>
                <p className="text-gray-700 mt-2 leading-relaxed">
                  "You," "User," or "Visitor" refers to the individual accessing the Website and its
                  Services. <br />
                  "We," "Us," or "Our" refers to Make Your Jobs and its affiliates.
                </p>
                <p className="text-gray-700 mt-2 leading-relaxed">
                  We may update these Terms at any time. Continued use of our Services after changes
                  are posted constitutes your acceptance of the revised Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2">2. Using Our Services</h2>
                <p className="text-gray-700 leading-relaxed">
                  You may access our Services only if you are of legal age to enter a binding contract.
                  You accept these Terms by:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Clicking "Agree" where prompted.</li>
                  <li>Using our Services, which implies acceptance of these Terms.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2">3. Modifications to Services</h2>
                <p className="text-gray-700 leading-relaxed">Make Your Jobs reserves the right to:</p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Modify, suspend, or discontinue any part of the Services without notice.</li>
                  <li>Change the Terms, with updates posted on the website.</li>
                </ul>
                <p className="text-gray-700 mt-2 leading-relaxed">
                  Your continued use after changes are made implies acceptance of the updated Terms.
                </p>
              </div>

              {/* Example final section */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">10. Reporting Abuse</h2>
                <p className="text-gray-700 leading-relaxed">
                  Users are responsible for their content on the website. We do not endorse or verify
                  user-generated content. If you encounter any violations or abuse, please report them
                  to{" "}
                  <a
                    href="mailto:reportabuse@makeyourjobs.com"
                    className="text-blue-600 hover:underline"
                  >
                    reportabuse@makeyourjobs.com
                  </a>
                  .
                </p>
              </div>

              <p className="text-gray-800 font-medium mt-6">
                By using our Services, you agree to these Terms. Thank you for being a part of Make Your Jobs!
              </p>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="hidden md:block md:w-2/5">
            <div className="flex justify-center">
              <img
                src={TermsImage}
                alt="Terms Illustration"
                className="w-80 rounded-xl "
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
