import React, { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
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
        <div 
            className="flex items-center justify-center h-screen w-screen bg-cover bg-center text-white"
            style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900')" }}
        >
            <div className="flex flex-col items-center text-center bg-black bg-opacity-60 p-12 rounded-lg shadow-xl w-11/12 max-w-lg">
                <h1 className="text-5xl font-extrabold mb-6">📸 AI Caption Generator</h1>
                <p className="text-lg mb-4">Upload an image and let AI do the magic!</p>
                
                <label className="cursor-pointer border-2 border-dashed border-gray-400 p-6 w-full text-center rounded-lg mb-4 hover:bg-gray-700 transition-all">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <FaUpload className="text-3xl mx-auto mb-2" />
                    <span>Click or Drag & Drop an Image</span>
                </label>
                
                {preview && (
                    <motion.img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
                
                <button 
                    onClick={handleUpload} 
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Caption"}
                </button>
                
                {caption && (
                    <motion.p 
                        className="mt-6 text-lg font-semibold text-gray-100 bg-gray-800 p-4 rounded-md shadow-md"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        ✨ Caption: {caption}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default Home;
