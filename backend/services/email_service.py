import random
import os
from mailersend import MailerSendClient, EmailBuilder

class EmailService:
    """Handle email operations using MailerSend API"""
    
    def __init__(self):
        self.api_key = os.getenv('MAILERSEND_API_KEY', 'mlsn.f0621451e79ca0b77e9588684da056854649d329922a3868367d8d412adb36cb')
        self.domain = os.getenv('MAILERSEND_DOMAIN', 'test-y7zpl98xj1545vx6.mlsender.net')
        self.from_email = f"info@{self.domain}"
        self.from_name = "QuickCart"
        
        # Initialize client with API key
        if self.api_key:
            self.client = MailerSendClient(api_key=self.api_key)
        else:
            self.client = None
        
    def generate_otp(self):
        """Generate a random 6-digit OTP"""
        return str(random.randint(100000, 999999))
    
    def send_email(self, to_email, subject, html_content, text_content=None):
        """Send email using MailerSend API"""
        try:
            if not self.client or not self.api_key:
                return False, "MailerSend API key not configured"
            
            # Build email using EmailBuilder
            email = (EmailBuilder()
                     .from_email(self.from_email, self.from_name)
                     .to_many([{"email": to_email, "name": to_email.split('@')[0]}])
                     .subject(subject)
                     .html(html_content)
                     .text(text_content or html_content)
                     .build())
            
            # Send email using the emails resource
            response = self.client.emails.send(email)
            
            print(f"✅ Email sent successfully to {to_email}")
            return True, response
            
        except Exception as e:
            print(f"⚠️ Email Error: {str(e)}")
            return False, str(e)
    
    def send_otp_email(self, email):
        """Generate and send OTP via email"""
        otp = self.generate_otp()
        
        subject = "Your QuickCart Verification Code"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: white;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .otp-box {{
                    background: #f0f0f0;
                    border: 2px dashed #667eea;
                    padding: 20px;
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #667eea;
                    margin: 20px 0;
                    border-radius: 8px;
                }}
                .warning {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }}
                .footer {{
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 12px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛒 QuickCart</h1>
                    <p>Verification Code</p>
                </div>
                <div class="content">
                    <h2>Hello!</h2>
                    <p>Your verification code for QuickCart is:</p>
                    
                    <div class="otp-box">
                        {otp}
                    </div>
                    
                    <p><strong>This code will expire in 5 minutes.</strong></p>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong><br>
                        Never share this code with anyone. QuickCart staff will never ask for your verification code.
                    </div>
                    
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 QuickCart. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        QuickCart Verification Code
        
        Your verification code is: {otp}
        
        This code will expire in 5 minutes.
        
        Never share this code with anyone. QuickCart staff will never ask for your verification code.
        
        If you didn't request this code, please ignore this email.
        
        © 2026 QuickCart. All rights reserved.
        """
        
        # Try to send email
        success, result = self.send_email(email, subject, html_content, text_content)
        
        if success:
            return {
                'success': True,
                'message': 'OTP sent successfully to your email',
                'provider': 'mailersend',
                'otp': otp
            }
        else:
            # Fallback to development mode
            print(f"💻 Email failed, using development mode. OTP: {otp}")
            return {
                'success': True,
                'message': 'Development mode: Email service unavailable',
                'provider': 'development',
                'otp': otp,
                'reason': 'email_service_failed'
            }
    
    def send_welcome_email(self, email, name):
        """Send welcome email to new users"""
        subject = "Welcome to QuickCart! 🎉"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: white;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .button {{
                    display: inline-block;
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 12px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛒 Welcome to QuickCart!</h1>
                </div>
                <div class="content">
                    <h2>Hello {name}! 👋</h2>
                    <p>Thank you for joining QuickCart - your one-stop shop for fresh groceries and daily essentials!</p>
                    
                    <p><strong>What you can do now:</strong></p>
                    <ul>
                        <li>✅ Browse thousands of products</li>
                        <li>✅ Add items to your cart</li>
                        <li>✅ Track your orders in real-time</li>
                        <li>✅ Get exclusive deals and offers</li>
                    </ul>
                    
                    <p>Happy shopping!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 QuickCart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to QuickCart!
        
        Hello {name}!
        
        Thank you for joining QuickCart - your one-stop shop for fresh groceries and daily essentials!
        
        What you can do now:
        - Browse thousands of products
        - Add items to your cart
        - Track your orders in real-time
        - Get exclusive deals and offers
        
        Happy shopping!
        
        © 2026 QuickCart. All rights reserved.
        """
        
        self.send_email(email, subject, html_content, text_content)
