from fastapi import FastAPI
from pydantic import BaseModel
import joblib 
import pandas as pd
import numpy as np
import spacy
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
from fastapi.middleware.cors import CORSMiddleware
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "Expanded_Mood_Activity_Dataset.csv")
model_path = os.path.join(BASE_DIR, "knn_model.pkl")

cache_dir = "/tmp/hf_cache"  # Creates 'hf_cache' in your app folder
os.environ["TRANSFORMERS_CACHE"] = cache_dir

if not os.path.exists(cache_dir):
    os.makedirs(cache_dir, exist_ok=True)

nlp = spacy.load("en_core_web_md")

df_moods = pd.read_csv(csv_path)
knn = joblib.load(model_path)

repo_name = "tjray3403/gpt2-finetuned-mood-fitness_suggestions"  # Replace with your model repo
try:
    tokenizer = GPT2Tokenizer.from_pretrained(repo_name, cache_dir="/tmp/hf_cache")
    model = GPT2LMHeadModel.from_pretrained(repo_name, cache_dir="/tmp/hf_cache").to("cpu")  # Use CPU in Hugging Face Spaces
    gpt2_loaded = True
    print("✅ GPT-2 Model Loaded")
except Exception as e:
    gpt2_loaded = False
    print(f"⚠️ GPT-2 Model Failed to Load: {e}")

def get_vector(text):
    doc = nlp(text)
    vec = doc.vector
    return vec.get() if hasattr(vec, "get") else vec  # Convert GPU arrays to NumPy

def find_closest_mood(user_input: str):
    user_vec = get_vector(user_input)
    distances, indices = knn.kneighbors([user_vec])
    best_idx = indices[0][0]
    return df_moods.iloc[best_idx]["mood"]

def generate_activity(mood):
    prompt = f"{mood} ->"
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=1024)
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]

    try:
        output = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            max_length=50,
            num_return_sequences=1,  # Ensures only one suggestion is generated
            temperature=0.7,  # Controls randomness
            top_p=0.9,  # Keeps suggestions high quality
            do_sample=True,
            pad_token_id=tokenizer.pad_token_id
        )
        generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
        activity = generated_text.split(".")[0].strip()

        if "->" in activity:
            activity = activity.split("->")[-1].strip()  # Get only the activity
        else:
            return activity
        #return generated_text.split("->")[-1].strip()
    except Exception as e:
        print(f"⚠️ GPT-2 Generation Failed: {e}")
        return None  # Trigger fallback

# **Main Suggestion Function**
def suggest_activity(user_input: str, user_steps: int = 0, user_water: float = 0.0):
    """Suggests an activity based on GPT-2 (default) or KNN (fallback)."""

    # **Step 1: Try GPT-2 First**
    if gpt2_loaded:
        activity_suggestion = generate_activity(user_input)
        if activity_suggestion:  # GPT-2 worked, return result
            additional_note = ""

            # **Modify suggestion based on steps & water intake**
            if user_steps < 3000:
                additional_note += " Your step count is low. A short walk might be helpful!"
            elif user_steps > 10000:
                additional_note += " You've been very active! Maybe try a relaxing activity."

            if user_water < 1.0:
                additional_note += " You might be dehydrated—drink more water!"
            elif user_water > 3.0:
                additional_note += " You're well-hydrated, great job!"
                
            return {
                "input": user_input,
                "matched_mood": user_input,
                "suggested_activity": activity_suggestion,
                "additional_note": additional_note.strip(),
                "model_used": "GPT-2"
            }

    matched_mood = find_closest_mood(user_input.lower())
    row = df_moods[df_moods["mood"] == matched_mood].iloc[0]
    activity_suggestion = row["activity"]

    additional_note = ""
    if user_steps < 3000:
        additional_note += " Your step count is low. A short walk might be helpful!"
    elif user_steps > 10000:
        additional_note += " You've been very active! Maybe try a relaxing activity."

    if user_water < 1.0:
        additional_note += " You might be dehydrated—drink more water!"
    elif user_water > 3.0:
        additional_note += " You're well-hydrated, great job!"


    return {
        "input": user_input,
        "matched_mood": matched_mood,
        "suggested_activity": activity_suggestion,
        "additional_note": additional_note.strip(),
        "model_used": "KNN (Fallback)"
    }

############################
# FastAPI Setup
############################
app = FastAPI()

# **CORS Configuration**
origins = [
    "http://localhost:8081",
    "http://serverIP:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# **Request Schema**
class SuggestRequest(BaseModel):
    mood: str
    steps: int = 0
    water: float = 0.0

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

@app.post("/suggest")
def suggest_endpoint(data: SuggestRequest):
    result = suggest_activity(data.mood, data.steps, data.water)
    return result
