#!/usr/bin/env python
# coding: utf-8

# In[9]:


#pip install flask pillow transformers torch


# In[10]:


from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import gradio as gr

# Load the pre-trained model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Function to generate a caption for the image
def generate_caption(img):
    img_input = Image.fromarray(img)
    inputs = processor(img_input, return_tensors="pt")
    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption

# Function to generate proper hashtags
def generate_hashtags(caption):
    stop_words = set(["is", "the", "in", "a", "an", "and", "or", "for", "of", "with", "on", "at", "by", "to", "from", "up", "down", "out", "over", "under", "again", "further", "then", "once"])
    words = [word.lower() for word in caption.split() if word.lower() not in stop_words and word.isalnum()]
    hashtags = []
    for i in range(len(words)):
        hashtag = "#" + words[i]
        hashtags.append(hashtag)
        if i < len(words) - 1:
            combined_hashtag = "#" + words[i] + words[i + 1]
            hashtags.append(combined_hashtag)
    if "dog" in words or "puppy" in words:
        hashtags.extend(["#dogsofinstagram", "#puppylove", "#doglovers"])
    if "park" in words or "nature" in words:
        hashtags.extend(["#naturelover", "#outdoors", "#greenery"])
    if "running" in words or "play" in words:
        hashtags.extend(["#fitness", "#active", "#fun"])
    hashtags = list(set(hashtags))[:10]
    return " ".join(hashtags)

# Combined function to generate both caption and hashtags
def generate_caption_and_hashtags(img):
    caption = generate_caption(img)
    hashtags = generate_hashtags(caption)
    return caption, hashtags


# Gradio interface with animations
demo = gr.Interface(
    fn=generate_caption_and_hashtags,
    inputs=[gr.Image(label="Upload Image", type="numpy")],
    outputs=[
        gr.Textbox(label="Generated Caption", lines=2),
        gr.Textbox(label="Generated Hashtags", lines=2)
    ],
    title="📷 Image Captioning and Hashtag Generator",
    description="Upload an image to generate a caption and relevant hashtags for social media. 🚀",
     # Inject custom CSS
    theme="soft",  # Use a modern theme
    allow_flagging="never"  # Disable flagging for simplicity
)

# Launch the interface
demo.launch()


# In[ ]:




