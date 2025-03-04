import React, { useState } from "react";
import axios from "axios";

const Home = () => {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);
        
        setLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/caption", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setCaption(response.data.caption);
        } catch (error) {
            console.error("Error generating caption", error);
            alert("Failed to generate caption");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600">Image Captioning App</h1>
            <p className="mt-4 text-lg text-gray-700">Upload an image and get AI-generated captions!</p>
            
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="mt-4"
            />
            
            <button 
                onClick={handleUpload} 
                className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Caption"}
            </button>
            
            {caption && (
                <p className="mt-6 text-lg font-semibold text-gray-800">Caption: {caption}</p>
            )}
        </div>
    );
};

export default Home;
