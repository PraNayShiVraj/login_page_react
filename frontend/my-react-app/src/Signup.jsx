import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css"; // Make sure to create this CSS file too!

function Signup() {
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

        try {
            const res = await fetch("http://127.0.0.1:8000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log("Signup response:", data);

            if (!res.ok) {
                alert(data.detail);
            } else {
                alert("Signup successful");
            }

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>

                <h2>Create Account</h2>
                <p>Sign up to manage your account</p>

                <div className="input-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phonenumber"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="signup_button" type="submit">Register</button>

                <div className="signup-text">
                    Already have an account? <Link to="/">Login</Link>
                </div>

            </form>
        </div>
    );
}

export default Signup;