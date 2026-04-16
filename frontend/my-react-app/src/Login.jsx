import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Use environment variables for flexibility
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5173";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Standard Login Handler
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "Login failed");
            } else {
                alert("Login successful 🎉");
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong");
        }
    };

    // ✅ Correct Google Success Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const googleToken = credentialResponse.credential;
            const res = await fetch(`${apiUrl}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Google Login successful! 🚀");
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                alert(data.detail || "Google authentication failed");
            }
        } catch (err) {
            console.error("Google Auth Error:", err);
            alert("Failed to connect to backend");
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="login-container">
                <div className="login-card">

                    {/* LEFT SIDE */}
                    <div className="login-left">
                        <img
                            src="/0415-ezgif.com-video-to-gif-converter.gif"
                            alt="Animated Robot"
                            className="side-gif"
                        />
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="login-content-wrapper">
                        <h2>Welcome Back</h2>
                        <p>Login to manage your account</p>

                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Sign In
                            </button>
                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        {/* ✅ Corrected: GoogleLogin component handles the popup and UI */}
                        <div className="google-login-wrapper">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => alert("Google Login Failed")}
                                theme="filled_blue"
                                shape="pill"
                                text="continue_with"
                                width="320" // Adjust width to match your CSS
                            />
                        </div>

                        <p className="signup-text">
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;