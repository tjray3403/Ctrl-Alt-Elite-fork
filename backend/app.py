from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
from pydantic import BaseModel

# Initialize Firebase
cred = credentials.Certificate("backend/firebase_key.json")  # Adjust path if needed
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize FastAPI
app = FastAPI()

# Allow CORS for all origins (frontend connections)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],  # Allows all headers
)

# Define request format
class MoodInput(BaseModel):
    mood: str

# API Endpoint: Get fitness suggestion from Firebase
@app.post("/suggest")
def suggest_activity(data: MoodInput):
    try:
        doc_ref = db.collection("mood_activity_mapping").document(data.mood)
        doc = doc_ref.get()

        if doc.exists:
            activity = doc.to_dict().get("suggested_activity", "No suggestion available")
        else:
            activity = "No suggestion found for this mood"

        return {"mood": data.mood, "suggested_activity": activity}
    
    except Exception as e:
        return {"error": str(e)}

# Root endpoint
@app.get("/")
def home():
    return {"message": "Firebase-Powered AI Activity Suggestion API Running"}
