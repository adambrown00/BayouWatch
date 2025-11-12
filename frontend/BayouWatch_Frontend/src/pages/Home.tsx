import React from "react";
import 'leaflet/dist/leaflet.css';
import Map from "../components/Map";


const Home: React.FC = () => {
    return (
        <main style={{ padding: "2rem", fontFamily: "Segoe UI, Roboto, -apple-system, sans-serif" }}>
            <h1> Welcome to BayouWatch!</h1>
             <div style={{ marginTop: "1rem" }}>
             <p> This is the home page where you can view the interactive map displaying flood data and reports. Use the navigation menu to explore alerts, flood history, reporting features, and more.</p>
            <Map />
            </div>
        </main>
    );
};

export default Home;