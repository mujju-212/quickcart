import React from 'react';
import { Container } from 'react-bootstrap';
import './StaticPages.css';

const TermsOfService = () => {
  const lastUpdated = "November 4, 2025";

  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">Terms of Service</h1>
          <p className="hero-subtitle">Terms and conditions for using QuickCart</p>
        </Container>
      </div>

      <Container className="py-5">
        <div className="legal-last-updated">
          <strong>Last Updated:</strong> {lastUpdated}
        </div>

        <div className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to QuickCart. By accessing or using our online grocery shopping platform, you agree to be 
            bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use 
            our services.
          </p>
          <p>
            We reserve the right to modify these Terms at any time. Your continued use of QuickCart after 
            changes constitutes acceptance of the modified Terms.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Eligibility</h2>
          <p>
            To use QuickCart, you must:
          </p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept full responsibility for all activities under your account</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Account Registration</h2>
          
          <h3>3.1 Creating an Account</h3>
          <p>
            To place orders, you must create an account using a valid mobile number. You will receive an 
            OTP (One-Time Password) for verification.
          </p>

          <h3>3.2 Account Security</h3>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account information</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Ensuring your contact information is current and accurate</li>
          </ul>

          <h3>3.3 Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account if you violate these Terms or engage 
            in fraudulent or illegal activities.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Orders and Payments</h2>
          
          <h3>4.1 Placing Orders</h3>
          <p>
            When you place an order through QuickCart:
          </p>
          <ul>
            <li>You are making an offer to purchase products at the listed prices</li>
            <li>We reserve the right to accept or reject your order</li>
            <li>Order confirmation does not guarantee product availability</li>
            <li>Prices are subject to change without notice</li>
          </ul>

          <h3>4.2 Payment Terms</h3>
          <ul>
            <li>Payment is required at the time of order placement</li>
            <li>We accept credit/debit cards, UPI, net banking, and cash on delivery (for eligible orders)</li>
            <li>All prices are in USD and include applicable taxes</li>
            <li>You authorize us to charge your payment method for the total order amount</li>
          </ul>

          <h3>4.3 Pricing and Availability</h3>
          <ul>
            <li>All prices displayed are subject to change</li>
            <li>We strive to provide accurate pricing, but errors may occur</li>
            <li>If a pricing error is discovered, we will notify you and give you the option to cancel</li>
            <li>Product availability is not guaranteed until order confirmation</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Delivery</h2>
          
          <h3>5.1 Delivery Areas</h3>
          <p>
            We deliver to specified areas only. Delivery availability is displayed during checkout.
          </p>

          <h3>5.2 Delivery Times</h3>
          <ul>
            <li>Estimated delivery times are approximate and not guaranteed</li>
            <li>Delays may occur due to unforeseen circumstances</li>
            <li>You must be available to receive delivery during the selected time slot</li>
            <li>We will attempt to contact you if delivery issues arise</li>
          </ul>

          <h3>5.3 Delivery Charges</h3>
          <ul>
            <li>Delivery is free for orders above $50</li>
            <li>Orders below $50 incur a $3 delivery fee</li>
            <li>Minimum order value is $20</li>
          </ul>

          <h3>5.4 Failed Deliveries</h3>
          <p>
            If delivery cannot be completed due to incorrect address, unavailability, or refusal to accept, 
            you may be charged for redelivery or the order may be canceled without refund.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Returns and Refunds</h2>
          
          <h3>6.1 Return Policy</h3>
          <p>We accept returns in the following cases:</p>
          <ul>
            <li>Damaged or defective products (report within 24 hours)</li>
            <li>Wrong items delivered (report immediately upon delivery)</li>
            <li>Missing items from your order</li>
            <li>Products past expiration date</li>
          </ul>

          <h3>6.2 Non-Returnable Items</h3>
          <p>The following cannot be returned:</p>
          <ul>
            <li>Fresh produce and perishables (unless damaged or defective)</li>
            <li>Opened or used products</li>
            <li>Items without original packaging</li>
          </ul>

          <h3>6.3 Refund Process</h3>
          <ul>
            <li>Approved refunds are processed within 5-7 business days</li>
            <li>Refunds are issued to the original payment method</li>
            <li>Refund amounts exclude delivery charges (unless the error was ours)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>7. Product Information</h2>
          <p>
            We strive to provide accurate product information, including descriptions, images, and nutritional 
            details. However:
          </p>
          <ul>
            <li>Images are for illustration purposes and may vary from actual products</li>
            <li>Product packaging and specifications may change</li>
            <li>We are not responsible for manufacturer changes to products</li>
            <li>Always check product labels for the most current information</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>8. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use our services for any illegal purpose</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt our services</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated systems (bots) to access our services</li>
            <li>Engage in fraudulent transactions</li>
            <li>Resell products purchased from QuickCart for commercial purposes</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>9. Intellectual Property</h2>
          <p>
            All content on QuickCart, including text, graphics, logos, images, and software, is the property 
            of QuickCart or its licensors and is protected by copyright, trademark, and other intellectual 
            property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works without our express 
            written permission.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Disclaimers and Limitation of Liability</h2>
          
          <h3>10.1 Service "As Is"</h3>
          <p>
            QuickCart is provided "as is" and "as available" without warranties of any kind, either express 
            or implied.
          </p>

          <h3>10.2 Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, QuickCart shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, including loss of profits, data, or goodwill.
          </p>

          <h3>10.3 Maximum Liability</h3>
          <p>
            Our total liability for any claims arising from your use of QuickCart shall not exceed the amount 
            paid by you for the specific order giving rise to the claim.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold QuickCart harmless from any claims, damages, losses, liabilities, 
            and expenses arising from your violation of these Terms or your use of our services.
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of the State of New York, without regard to conflict of law 
            principles.
          </p>
          <p>
            Any disputes arising from these Terms or your use of QuickCart shall be resolved through binding 
            arbitration in accordance with the rules of the American Arbitration Association.
          </p>
        </div>

        <div className="legal-section">
          <h2>13. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
            shall continue in full force and effect.
          </p>
        </div>

        <div className="legal-section">
          <h2>14. Contact Information</h2>
          <p>For questions about these Terms of Service, contact us:</p>
          <ul>
            <li><strong>Email:</strong> legal@quickcart.com</li>
            <li><strong>Phone:</strong> +1 (800) 123-4567</li>
            <li><strong>Address:</strong> 123 Market Street, Shopping District, New York, NY 10001</li>
          </ul>
        </div>

        <div className="legal-section">
          <p className="text-muted">
            By using QuickCart, you acknowledge that you have read, understood, and agree to be bound by 
            these Terms of Service.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;
