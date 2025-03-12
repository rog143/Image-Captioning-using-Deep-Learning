from fastapi import FastAPI, UploadFile, File
import requests
import shutil

app = FastAPI()

# Hugging Face API Endpoint
API_URL = "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning"
HEADERS = {"Authorization": "Bearer YOUR_HUGGINGFACE_API_KEY"}

def query_image(image_path):
    """Sends image to Hugging Face API and retrieves caption."""
    with open(image_path, "rb") as f:
        response = requests.post(API_URL, headers=HEADERS, files={"image": f})
    return response.json()

@app.post("/caption/")
async def generate_caption(file: UploadFile = File(...)):
    """Receives image, saves it, and sends to pretrained model."""
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Get caption from pretrained model
    result = query_image(file_path)
    caption = result[0]["generated_text"] if result else "Caption generation failed."

    return {"caption": caption}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
