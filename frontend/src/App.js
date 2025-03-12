import React, { useState } from "react";
import axios from "axios";

function App() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));  // Preview Image
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await axios.post("http://localhost:8000/caption/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setCaption(response.data.caption);
        } catch (error) {
            console.error("Error:", error);
            setCaption("Error generating caption.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2 style={{ fontWeight: "bold" }}>Image Captioning</h2>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Generate Caption</button>
            
            {preview && <img src={preview} alt="Uploaded Preview" style={{ marginTop: "20px", width: "300px", borderRadius: "10px" }} />}
            
            {caption && (
                <div>
                    <h3>Generated Caption:</h3>
                    <p>{caption}</p>
                </div>
            )}
        </div>
    );
}

export default App;
