import os
import random
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv # Add this
load_dotenv()

# Brevo configuration
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "pranayshivraj13@gmail.com")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "CyberAuth")

def generate_otp():
    """Generates a 6-digit OTP code."""
    return f"{random.randint(100000, 999999)}"

def send_otp_email(target_email, otp_code):
    """Sends an OTP email via Brevo API."""
    if not BREVO_API_KEY or BREVO_API_KEY == "your_brevo_api_key_here":
        print(f"DEBUG: BREVO_API_KEY not set. OTP for {target_email} is: {otp_code}")
        return True

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = BREVO_API_KEY
    
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": target_email}],
        sender={"name": BREVO_SENDER_NAME, "email": BREVO_SENDER_EMAIL},
        subject="Your OTP Verification Code",
        html_content = f"""
<div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; border: 1px solid #e1e4e8; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #0052cc; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-weight: 600; letter-spacing: 0.5px;">Verification Required</h2>
    </div>
    <div style="padding: 40px 20px; text-align: center; background-color: #ffffff;">
        <p style="font-size: 16px; color: #555; margin-bottom: 24px;">To complete your sign-in, please use the following one-time passcode. This code is valid for <strong>5 minutes</strong>.</p>
        
        <div style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #0052cc; background-color: #f4f5f7; padding: 15px 30px; border-radius: 4px; border: 1px solid #dfe1e6;">
            {otp_code}
        </div>
        
        <p style="font-size: 14px; color: #888; margin-top: 30px;">
            If you did not request this code, you can safely ignore this email. 
            For security, do not share this code with anyone.
        </p>
    </div>
    <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e1e4e8;">
    </div>
</div>
"""
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        return True
    except ApiException as e:
        print(f"Exception when calling Brevo API: {e}")
        return False
