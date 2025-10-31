import React from "react";

const Profile: React.FC = () => {
    return (
        <main style={{ padding: "2rem", fontFamily: "Segoe UI, Roboto, -apple-system, sans-serif" }}>
            <h1>Profile Management</h1>
            <p>This is a placeholder Profile page for the BayouWatch frontend.</p>
            <p>Replace this content following the Figma design.</p>
            <div style={{ marginTop: "1rem" }}>

                
                <button // Return Home button, example/can be "back" or other button
                    onClick={() => (window.location.href = "/")} // Points to /Home
                    style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                >
                    Go to Home
                </button>
            </div>
        </main>
    );
};

export default Profile;