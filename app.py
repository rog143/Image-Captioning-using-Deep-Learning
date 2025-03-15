import os
import logging
from flask import Flask, render_template, request, jsonify
import pickle
from typing import Any, Dict, List

# Assuming TextToNum is a class you have defined elsewhere
# from test import TextToNum

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_pickle(file_path: str) -> Any:
    """Load a pickle file."""
    try:
        with open(file_path, "rb") as file:
            return pickle.load(file)
    except Exception as e:
        logger.error(f"Error loading {file_path}: {e}")
        raise

def preprocess_message(msg: str) -> List[str]:
    """Preprocess the input message."""
    try:
        ob = TextToNum(msg)
        ob.cleaner()
        ob.token()
        ob.removeStop()
        stemmed_msg = ob.stemme()
        logger.info(f"Preprocessed message: {stemmed_msg}")
        return stemmed_msg
    except Exception as e:
        logger.error(f"Error during preprocessing: {e}")
        raise

def predict_message(stemmed_msg: List[str], vectorizer, model) -> str:
    """Predict the result using the preprocessed message."""
    try:
        stvc = " ".join(stemmed_msg)
        data = vectorizer.transform([stvc])
        logger.info(f"Vectorized data: {data}")
        pred = model.predict(data)
        logger.info(f"Prediction: {pred}")
        return str(pred[0])
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise

@app.route("/")
def home() -> str:
    """Render the home page."""
    return render_template("index.html")

@app.route("/predict", methods=["GET", "POST"])
def predict() -> str:
    """Handle the prediction request."""
    if request.method == "POST":
        try:
            msg = request.form.get("message")
            if not msg:
                return jsonify({"error": "No message provided"}), 400

            logger.info(f"Received message: {msg}")
            
            # Preprocess the message
            stemmed_msg = preprocess_message(msg)
            
            # Load vectorizer and model
            vectorizer = load_pickle("vectorizer.pickle")
            model = load_pickle("model.pickle")
            
            # Predict the result
            result = predict_message(stemmed_msg, vectorizer, model)
            
            return jsonify({"result": result})
        
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return jsonify({"error": "An error occurred during prediction"}), 500
    
    return render_template("predict.html")

if __name__ == "__main__":
    # Use environment variables for host and port
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", 8000))
    app.run(host=host, port=port, debug=True)  # Enable debug mode