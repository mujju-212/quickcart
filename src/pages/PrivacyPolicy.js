import React from 'react';
import { Container } from 'react-bootstrap';
import './StaticPages.css';

const PrivacyPolicy = () => {
  const lastUpdated = "November 4, 2025";

  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">Privacy Policy</h1>
          <p className="hero-subtitle">How we collect, use, and protect your information</p>
        </Container>
      </div>

      <Container className="py-5">
        <div className="legal-last-updated">
          <strong>Last Updated:</strong> {lastUpdated}
        </div>

        <div className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to QuickCart ("we," "our," or "us"). We respect your privacy and are committed to protecting 
            your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your 
            information when you use our online grocery shopping platform.
          </p>
          <p>
            By using QuickCart, you agree to the collection and use of information in accordance with this policy. 
            If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information (email address, phone number)</li>
            <li>Delivery addresses</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Account credentials (phone number for OTP-based authentication)</li>
            <li>Order history and preferences</li>
            <li>Customer service communications</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you access our services, we automatically collect:</p>
          <ul>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, click patterns)</li>
            <li>Location data (with your permission, for delivery purposes)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul>
            <li><strong>Order Processing:</strong> To process and deliver your orders</li>
            <li><strong>Account Management:</strong> To create and manage your account</li>
            <li><strong>Customer Service:</strong> To respond to your inquiries and provide support</li>
            <li><strong>Personalization:</strong> To customize your shopping experience</li>
            <li><strong>Communication:</strong> To send order updates, promotional offers, and important notices</li>
            <li><strong>Analytics:</strong> To improve our services and understand user behavior</li>
            <li><strong>Security:</strong> To detect and prevent fraud and unauthorized access</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We may share your information in the following circumstances:</p>
          
          <h3>4.1 Service Providers</h3>
          <p>
            We share information with third-party service providers who perform services on our behalf, such as:
          </p>
          <ul>
            <li>Payment processors</li>
            <li>Delivery partners</li>
            <li>SMS service providers</li>
            <li>Cloud hosting services</li>
            <li>Analytics providers</li>
          </ul>

          <h3>4.2 Legal Requirements</h3>
          <p>We may disclose your information if required by law or in response to valid requests by public authorities.</p>

          <h3>4.3 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your information may be transferred 
            to the acquiring entity.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against 
            unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul>
            <li>Encryption of sensitive data (SSL/TLS)</li>
            <li>Secure authentication mechanisms (JWT tokens, OTP verification)</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and employee training</li>
            <li>Secure payment processing (PCI-DSS compliant)</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. 
            While we strive to protect your data, we cannot guarantee absolute security.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          <p>
            To exercise these rights, please contact us at privacy@quickcart.com or through your account settings.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience. You can control cookies 
            through your browser settings. However, disabling cookies may limit your ability to use certain features 
            of our services.
          </p>
          <p>Types of cookies we use:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our site</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Advertising Cookies:</strong> Deliver relevant advertisements (with your consent)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly collect 
            personal information from children. If you believe we have collected information from a child, 
            please contact us immediately.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to fulfill the purposes outlined in this 
            privacy policy, unless a longer retention period is required by law. Order history and transaction 
            records are typically retained for 7 years for accounting and legal purposes.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by 
            posting the new policy on this page and updating the "Last Updated" date. Your continued use of our 
            services after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Contact Us</h2>
          <p>If you have questions or concerns about this privacy policy, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> privacy@quickcart.com</li>
            <li><strong>Phone:</strong> +1 (800) 123-4567</li>
            <li><strong>Address:</strong> 123 Market Street, Shopping District, New York, NY 10001</li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
