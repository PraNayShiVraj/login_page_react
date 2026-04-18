import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

// Fallback to the actual backend URL on Render if environment variable is missing
const apiUrl = import.meta.env.VITE_API_URL || "https://login-page-react-backend.onrender.com";

function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Email, 3: OTP
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const otpRefs = useRef([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phonenumber: ""
    });

    useEffect(() => {
        let interval;
        if (step === 3 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otpDigits];
        newOtp[index] = value.slice(-1);
        setOtpDigits(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleNextToEmail = (e) => {
        e.preventDefault();
        // Basic validation for Step 1
        if (!formData.name || !formData.password) {
            alert("Please fill in required fields.");
            return;
        }
        setStep(2);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            alert("Email is required for verification.");
            return;
        }
        setLoading(true);

        try {
            console.log("DEBUG: Requesting OTP via:", `${apiUrl}/send-otp`);
            const res = await fetch(`${apiUrl}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to send OTP.");

            setStep(3);
            setTimer(60);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpValue = otpDigits.join("");
        if (otpValue.length < 6) {
            alert("Please enter all 6 digits.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp: otpValue }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Verification failed.");

            alert("Registration complete!");
            navigate("/");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setTimer(60);
                setOtpDigits(["", "", "", "", "", ""]);
                alert("New OTP sent!");
            }
        } catch (err) {
            alert("Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    // --- Step 3: OTP View ---
    if (step === 3) {
        return (
            <div className="signup-container">
                <div className="signup-form">
                    <h2>Verify Identity</h2>
                    <p>Access code sent to</p>
                    <h3>{formData.email}</h3>

                    <div className="otp-input-container">
                        {otpDigits.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (otpRefs.current[idx] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                            />
                        ))}
                    </div>

                    <button className="signup_button" onClick={handleVerifyOTP} disabled={loading}>
                        {loading ? "Verifying..." : "Confirm"}
                    </button>

                    <div className="resend-container">
                        {timer > 0 ? (
                            <span className="timer-text">Resend in: {timer}s</span>
                        ) : (
                            <button className="resend-btn" onClick={handleResend}>Request New OTP</button>
                        )}
                    </div>
                    <button className="back-link" onClick={() => setStep(2)}>
                        Change Email
                    </button>
                </div>
            </div>
        );
    }

    // --- Step 2: Email Entry ---
    if (step === 2) {
        return (
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSendOTP}>
                    <h2>Email Verification</h2>
                    <p>Enter your email address</p>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="user@network.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="signup_button" type="submit" disabled={loading}>
                        {loading ? "Transmitting..." : "Send OTP"}
                    </button>

                    <button className="back-link" style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', marginTop: '20px', fontSize: '0.9rem' }} onClick={() => setStep(1)}>
                        Edit Personal Info
                    </button>
                </form>
            </div>
        );
    }

    // --- Step 1: Basic Info ---
    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleNextToEmail}>
                <h2>Create Account</h2>
                <p>:.__.:</p>
                <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} placeholder="Full Name" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Phone Number</label>
                    <input type="text" name="phonenumber" value={formData.phonenumber} placeholder="Phno (optional)" onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required />
                </div>
                <button className="signup_button" type="submit">
                    Verify Email
                </button>
                <div className="signup-text">
                    Already have an account? <Link to="/">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;
