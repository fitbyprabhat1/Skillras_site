import React from 'react';
import NavBar from '../components/NavBar';
import { Shield, FileText, Clock, User, Lock, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-dark via-dark-light to-dark">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center bg-primary/20 border border-primary/30 rounded-full px-6 py-2 mb-8">
            <Shield className="text-primary mr-2" size={20} />
            <span className="text-sm font-medium">Legal Information</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms and <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services. 
            By accessing or using our platform, you agree to be bound by these terms.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Clock className="mr-2" size={16} />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <FileText className="mr-2" size={16} />
              <span>Version 2.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-dark-light rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertTriangle className="text-yellow-500 mr-3" size={24} />
              Important Notice
            </h2>
            <p className="text-gray-300 mb-4">
              These terms and conditions govern your use of SKillras Private Limited services and website. 
              By using our services, you accept these terms in full. If you disagree with any part of these terms, 
              please do not use our services.
            </p>
            <p className="text-gray-300">
              Users are strongly advised to read the complete Terms and Privacy Policy before accessing or using the Service.
            </p>
          </div>

          <div className="space-y-12">
            {/* 1. Agreement */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">1. Agreement</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>1.1</strong> These Terms of Service ("Terms") govern your access to and use of SKillras Private Limited services and the website.
                </p>
                <p>
                  <strong>1.2</strong> The Privacy Policy forms an integral part of these Terms, explaining how user data is collected, safeguarded, and disclosed.
                </p>
                <p>
                  <strong>1.3</strong> By using the Service, you confirm that you have read, understood, and agree to abide by these Terms and the Privacy Policy.
                </p>
                <p>
                  <strong>1.4</strong> If you do not agree to these Terms, you are prohibited from accessing or using the Service. Any concerns must be communicated via email to support@skillras.com.
                </p>
              </div>
            </div>

            {/* 2. Communications */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">2. Communications</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>2.1</strong> By using the Service, you consent to receive newsletters, marketing materials, and other communications.
                </p>
                <p>
                  <strong>2.2</strong> You can opt out of such communications by using the unsubscribe link provided or contacting support@skillras.com.
                </p>
              </div>
            </div>

            {/* 3. Purchases */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">3. Purchases</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>3.1</strong> All purchases through the Service require accurate billing and payment details, including credit/debit card information, billing address, and shipping address.
                </p>
                <p>
                  <strong>3.2</strong> Users represent that they have the legal authority to use the provided payment methods and ensure the accuracy of the provided information.
                </p>
                <p>
                  <strong>3.3</strong> SKillras Private Limited may engage third-party payment services, and by making a purchase, you authorize the sharing of necessary details under the Privacy Policy.
                </p>
                <p>
                  <strong>3.4</strong> SKillras Private Limited reserves the right to refuse or cancel orders for reasons including product/service unavailability, pricing errors, or suspected fraudulent activity.
                </p>
              </div>
            </div>

            {/* 4. Subscriptions */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">4. Subscriptions</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>4.1</strong> Subscription services are billed on a recurring basis ("Billing Cycle"), depending on the chosen plan.
                </p>
                <p>
                  <strong>4.2</strong> Subscriptions automatically renew unless canceled by the user or terminated by SKillras Private Limited.
                </p>
                <p>
                  <strong>4.3</strong> Users may cancel their subscriptions via the account management page or by contacting customer support.
                </p>
                <p>
                  <strong>4.4</strong> A valid payment method is mandatory for subscription processing. Failure to process payments may result in immediate termination of the subscription.
                </p>
              </div>
            </div>

            {/* 5. Fee Changes */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">5. Fee Changes</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>5.1</strong> SKillras Private Limited reserves the right to modify subscription fees at its sole discretion.
                </p>
                <p>
                  <strong>5.2</strong> Changes to fees will become effective at the end of the current Billing Cycle, with reasonable notice provided to users.
                </p>
                <p>
                  <strong>5.3</strong> Continued use of the Service after the effective date of the fee change implies acceptance of the revised fees.
                </p>
              </div>
            </div>

            {/* 6. Refund Policy */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">6. Refund Policy</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-lg font-semibold mt-4">Refund Timeframe</h3>
                <p>
                  <strong>1.1</strong> Refund requests must be submitted within 24 hours of purchase.
                </p>
                <p>
                  <strong>1.2</strong> Approved refunds will be processed within 48 hours of the request.
                </p>
                <p>
                  <strong>1.3</strong> Refunds are not available for purchases made after the 24-hour period.
                </p>

                <h3 className="text-lg font-semibold mt-4">Exclusions</h3>
                <p>
                  <strong>2.1</strong> Upgraded packages are strictly non-refundable.
                </p>

                <h3 className="text-lg font-semibold mt-4">Deductions</h3>
                <p>
                  <strong>3.1</strong> Refunds will incur a 2% payment gateway fee and a 5% processing fee, which will be deducted from the refund amount.
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  For all refund-related inquiries, please contact us via email at refunds@skillras.com.
                </p>
              </div>
            </div>

            {/* 7. Prohibited Uses */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">7. Prohibited Uses</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-lg font-semibold">General Restrictions</h3>
                <p>
                  <strong>1.1</strong> You may use the Service solely for lawful purposes and in strict compliance with these Terms and Conditions.
                </p>
                <p>
                  <strong>1.2</strong> You agree not to utilize the Service in any manner that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violates any applicable local, national, or international laws, regulations, or ordinances.</li>
                  <li>Exploits, endangers, or harms minors in any form or manner.</li>
                  <li>Transmits unsolicited advertising, promotional materials, or other forms of solicitation.</li>
                  <li>Impersonates the Company, its employees, other users, or any third party.</li>
                  <li>Infringes upon the legal rights of others or facilitates any unlawful activity.</li>
                  <li>Restricts, disrupts, or otherwise inhibits any other user's enjoyment or use of the Service.</li>
                  <li>Uploads any videos or content featuring our CEO or management team without explicit prior approval.</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Violation & Consequences</h3>
                <p>
                  <strong>a.</strong> Failure to comply will result in strict action:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>First Offense: Formal warning and policy acknowledgment</li>
                  <li>Repeated Violations: Suspension of affiliate privileges</li>
                  <li>Severe Misconduct: Immediate termination</li>
                  <li>Legal Action: For reputational damage or legal issues</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Additional Limitations</h3>
                <p>
                  <strong>2.1</strong> Furthermore, you expressly agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Disrupt, overburden, damage, or impair Service functionality</li>
                  <li>Employ automated systems or bots without authorization</li>
                  <li>Introduce malicious software or harmful code</li>
                  <li>Attempt unauthorized access to Service systems</li>
                  <li>Launch DoS or DDoS attacks</li>
                  <li>Damage or falsify Company reputation</li>
                </ul>
              </div>
            </div>

            {/* 8. Accounts */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">8. Accounts</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-lg font-semibold">Account Registration</h3>
                <p>
                  <strong>1.1</strong> By creating an account, you affirm that you are at least 14 years of age.
                </p>
                <p>
                  <strong>1.2</strong> You warrant that registration information is accurate, complete, and up-to-date.
                </p>
                <p>
                  <strong>1.3</strong> Accounts with inaccurate information may be terminated.
                </p>
                <p>
                  <strong>1.4</strong> Creating multiple accounts is prohibited. Violations will result in reassignment of affiliate IDs and forfeiture of commissions.
                </p>

                <h3 className="text-lg font-semibold mt-4">Account Responsibilities</h3>
                <p>
                  <strong>2.1</strong> You are responsible for maintaining account confidentiality.
                </p>
                <p>
                  <strong>2.2</strong> Notify the Company immediately of any unauthorized access.
                </p>
                <p>
                  <strong>2.3</strong> Prohibited usernames include offensive or infringing language.
                </p>
                <p>
                  <strong>2.4</strong> The Company retains the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Refuse or restrict Service access</li>
                  <li>Suspend or terminate accounts</li>
                  <li>Remove or modify user content</li>
                  <li>Cancel orders without prior notice</li>
                </ul>
              </div>
            </div>

            {/* 9. Intellectual Property */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">9. Intellectual Property</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-lg font-semibold">Ownership</h3>
                <p>
                  <strong>1.1</strong> The Service and all original content are the sole property of SKillras Private Limited and its licensors.
                </p>
                <p>
                  <strong>1.2</strong> Protected under copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  <strong>1.3</strong> No trademarks or logos may be used without express written consent.
                </p>

                <h3 className="text-lg font-semibold mt-4">Copyright Policy</h3>
                <p>
                  <strong>1.1</strong> The Company respects intellectual property rights.
                </p>
                <p>
                  <strong>1.2</strong> Claims of infringement should be submitted to support@skillras.com.
                </p>
                <p>
                  <strong>2.1</strong> False claims may result in liability for damages.
                </p>

                <h3 className="text-lg font-semibold mt-4">DMCA Notice</h3>
                <p>
                  <strong>1.1</strong> DMCA notifications must include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Signature of copyright owner or representative</li>
                  <li>Description of copyrighted work</li>
                  <li>Identification of infringing material</li>
                  <li>Claimant's contact information</li>
                  <li>Good-faith belief statement</li>
                  <li>Accuracy declaration under penalty of perjury</li>
                </ul>
                <p className="mt-4">
                  <strong>2.1</strong> DMCA notices should be directed to support@skillras.com.
                </p>
              </div>
            </div>

            {/* 10. Limitation of Liability */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">10. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>7.1</strong> SKillras Private Limited shall not be held liable for indirect, incidental, or consequential damages resulting from the use or inability to use the Service.
                </p>
                <p>
                  <strong>7.2</strong> The Service is provided "as is" without warranties of any kind, whether express or implied.
                </p>
                <p>
                  <strong>8.1</strong> These Terms shall be governed by and construed in accordance with the laws of INDIA.
                </p>
                <p>
                  <strong>8.2</strong> Any disputes shall be subject to the exclusive jurisdiction of the courts in NEW DELHI.
                </p>
                <p className="mt-4">
                  Except where prohibited by law, the Company shall not be liable for any indirect, incidental, special, punitive, or consequential damages. If liability is established, it shall be strictly limited to the total amount paid by you for the Service.
                </p>
              </div>
            </div>

            {/* 11. Beware of Fraudulent Activities */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">11. Beware of Fraudulent Activities</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>1.</strong> Official Communication: Only through support@skillras.com.
                </p>
                <p>
                  <strong>2.</strong> No Request for Sensitive Information: OTPs, passwords, etc.
                </p>
                <p>
                  <strong>3.</strong> Submit Information: Only through official email.
                </p>
                <p>
                  <strong>4.</strong> Authorized Support: Only WhatsApp number +91-8287644407.
                </p>
                <p>
                  <strong>5.</strong> Official Announcements: Only through verified social media accounts.
                </p>
                <p>
                  <strong>6.</strong> Monetary Transactions: No fees requested post-enrollment.
                </p>
                <p>
                  <strong>7.</strong> Liability Disclaimer: Not responsible for unauthorized transactions.
                </p>
              </div>
            </div>

            {/* 12. Affiliate Guidelines */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">12. Affiliate Guidelines</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  At SKillras Private Limited, we endeavor to represent our products and services accurately, including their income-generating potential. However, there is no guarantee of achieving specific income levels, as success is influenced by individual effort, expertise, and market conditions.
                </p>
                <p>
                  The Company disclaims liability for any earnings or business outcomes arising from the use of its products, services, or affiliate program. Testimonials are exceptional results and should not be interpreted as typical outcomes.
                </p>
                <p>
                  By using our services, you acknowledge and accept that the Company is not liable for any business success or failure connected to your use of our offerings.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-dark-light rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">Contact Information</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-dark rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-semibold">Email:</p>
                        <p>support@skillras.com</p>
                        <p className="text-sm text-gray-400 mt-1">(For general inquiries)</p>
                        <p>refunds@skillras.com</p>
                        <p className="text-sm text-gray-400 mt-1">(For refund inquiries)</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-semibold">WhatsApp Support:</p>
                        <p>+91-8287644407</p>
                        <p className="text-sm text-gray-400 mt-1">(Official support number)</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-semibold">Address:</p>
                        <p>SKillras Private Limited, New Delhi, India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-dark-light">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-300 mb-8">
            If you need clarification on any of these terms or have concerns about our services, 
            please don't hesitate to reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@skillras.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <User className="mr-2" size={20} />
              Contact Support
            </a>
            <a 
              href="/privacy-policy" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-dark-lighter transition-colors"
            >
              <Lock className="mr-2" size={20} />
              Privacy Policy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;