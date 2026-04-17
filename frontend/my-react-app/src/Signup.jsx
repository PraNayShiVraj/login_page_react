import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

// Fallback to the actual backend URL on Render if environment variable is missing
const apiUrl = import.meta.env.VITE_API_URL || "https://login-page-react-backend.onrender.com";

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
            // Note: Targeting the backend URL supplied by user
            console.log("DEBUG: Posting to:", `${apiUrl}/signup`);
            const res = await fetch(`${apiUrl}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const text = await res.text(); // Get raw text first
            let data = {};

            try {
                data = text ? JSON.parse(text) : {};
            } catch (jsonErr) {
                console.error("Server returned non-JSON response:", text);
                throw new Error("Server error: Received invalid data format.");
            }

            if (!res.ok) {
                throw new Error(data.detail || "Signup failed. Please try again.");
            }

            alert("Signup successful!");
            navigate("/");

        } catch (err) {
            console.error("DEBUG:", err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" name="name" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Phone Number</label>
                    <input type="text" name="phonenumber" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
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