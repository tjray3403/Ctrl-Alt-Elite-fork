from fastapi import FastAPI
import joblib
from pydantic import BaseModel

# Load trained model and encoders
model = joblib.load("activity_suggestion.pkl")
emotion_encoder = joblib.load("emotion_encoder.pkl")
activity_encoder = joblib.load("activity_encoder.pkl")

# Initialize FastAPI
app = FastAPI()

# Define the request body structure
class MoodInput(BaseModel):
    mood: str

# API Endpoint: Receive mood & return suggested activity
@app.post("/suggest")
def suggest_activity(data: MoodInput):
    try:
        # Convert mood to numeric format
        mood_encoded = emotion_encoder.transform([data.mood])

        # Predict the activity
        predicted_activity_encoded = model.predict([mood_encoded])
        predicted_activity = activity_encoder.inverse_transform(predicted_activity_encoded)

        return {"mood": data.mood, "suggested_activity": predicted_activity[0]}
    
    except Exception as e:
        return {"error": str(e)}

# Root endpoint
@app.get("/")
def home():
    return {"message": "AI Activity Suggestion API is Running"}
