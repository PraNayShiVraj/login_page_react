import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phonenumber: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Note: Added a trailing slash as some servers (FastAPI/Django) require it
            const res = await fetch(`${apiUrl}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                // If backend returns 400 or 500
                throw new Error(data.detail || data.message || "Signup failed");
            } else {
                alert("Signup successful!");
                navigate("/"); // Redirect to login after success
            }

        } catch (err) {
            console.error("DEBUG: Signup Error Details:", err);
            // This will show if it's a CORS error or Network error
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <p>Sign up to manage your account</p>

                <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                </div>

                <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
                </div>

                <div className="input-group">
                    <label>Phone Number</label>
                    <input type="text" name="phonenumber" placeholder="Phone Number" onChange={handleChange} required />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                </div>

                <button className="signup_button" type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

                <div className="signup-text">
                    Already have an account? <Link to="/">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;