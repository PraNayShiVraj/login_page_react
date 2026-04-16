import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            const data = await res.json();
            console.log("Login response:", data);

            if (!res.ok) {
                alert(data.detail || "Login failed");
            } else {
                alert("Login successful 🎉");

                // ✅ Save user in localStorage
                localStorage.setItem("user", JSON.stringify(data.user));

                // ✅ Redirect to dashboard
                navigate("/dashboard");
            }

        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong");
        }
    };

    const handleGoogleLogin = () => {
        console.log("Redirecting to Google...");
        // future OAuth login
    };

    return (
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

                    <button className="google-btn" onClick={handleGoogleLogin}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg"
                            alt="Google"
                        />
                        Continue with Google
                    </button>

                    <p className="signup-text">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;