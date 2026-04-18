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
        html_content=f"""
        <div style="font-family: 'Courier New', Courier, monospace; background-color: #0d0208; color: #00ff41; padding: 20px; border: 2px solid #00ff41;">
            <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 5px;">Verification Required</h2>
            <p style="font-size: 1.2em;">Secure link established. Your one-time access code is:</p>
            <div style="font-size: 3em; text-align: center; margin: 20px 0; border: 1px dashed #00ff41; padding: 10px;">
                {otp_code}
            </div>
            <p>This code expires in 5 minutes. Do not share this with unauthorized personnel.</p>
        </div>
        """
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        return True
    except ApiException as e:
        print(f"Exception when calling Brevo API: {e}")
        return False
