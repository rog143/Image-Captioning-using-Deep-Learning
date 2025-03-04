import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "./pages/Home";

function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Welcome to Image Captioning</h1>
            <button onClick={() => navigate("/upload")}>Go to Upload Page</button>
        </div>
    );
}

export default Home;
