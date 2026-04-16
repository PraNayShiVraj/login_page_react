import React from "react";
import { useNavigate } from "react-router-dom";

function Page() {
    const navigate = useNavigate();

    // get user data from login
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1>Welcome 🎉</h1>

                {user ? (
                    <>
                        <p><b>Name:</b> {user.name}</p>
                        <p><b>Email:</b> {user.email}</p>

                        <button onClick={handleLogout} style={styles.button}>
                            Logout
                        </button>
                    </>
                ) : (
                    <p>No user found</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(160deg, #000000 0%, #61dfff 100%)",
        fontFamily: "Inter"
    },
    card: {
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        textAlign: "center",
        width: "300px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    },
    button: {
        marginTop: "20px",
        padding: "10px 20px",
        background: "#667eea",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    }
};

export default Page;