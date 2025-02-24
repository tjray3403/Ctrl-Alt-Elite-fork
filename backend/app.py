from fastapi import FastAPI
from pydantic import BaseModel
import joblib 
import pandas as pd
import numpy as np
import spacy
from fastapi.middleware.cors import CORSMiddleware
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


nlp = spacy.load("en_core_web_md")

csv_path = os.path.join(BASE_DIR, "mood_activity.csv")
model_path = os.path.join(BASE_DIR, "knn_model.pkl")

df_moods = pd.read_csv(csv_path)
knn = joblib.load(model_path)



def get_vector(text):
    doc = nlp(text)
    vec = doc.vector
    if hasattr(vec, "get"):  # if GPU array
        return vec.get()
    return vec

def find_closest_mood(user_input: str):
    user_vec = get_vector(user_input)
    distances, indices = knn.kneighbors([user_vec])
    best_idx = indices[0][0]
    best_mood = df_moods.iloc[best_idx]["mood"]
    return best_mood

def suggest_activity(user_input: str, user_steps: int = 0, user_water: float = 0.0):
    matched_mood = find_closest_mood(user_input.lower())
    row = df_moods[df_moods["mood"] == matched_mood].iloc[0]
    activity_suggestion = row["activity"]

    additional_note = ""
    if user_steps < 3000:
        additional_note += " It looks like your steps are low, consider a short walk!"
    elif user_steps > 10000:
        additional_note += " You've walked a ton today! Maybe try a gentle stretch."

    if user_water < 1.0:
        additional_note += " You might want to drink more water."
    elif user_water > 3.0:
        additional_note += " Great job staying hydrated!"

    message = (f"Since you're feeling {matched_mood}, try this activity: "
               f"{activity_suggestion}.{additional_note}")

    return {
        "input": user_input,
        "matched_mood": matched_mood,
        "suggested_activity": activity_suggestion,
        "dynamic_message": message
    }

############################
# FastAPI Endpoint
############################

app = FastAPI()

# Allow calls from specific origins in development:
origins = [
    "http://localhost:8081",       # React Native/Web?
    "http://serverIP:3000",    # if you run an Expo/Web dev server
    # "exp://192.168.1.46:19000",  # Example for Expo
    # "http://localhost:3000",     # Another dev origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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