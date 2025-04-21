import { styles } from "../../config/styles";
import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  DocumentReference, 
  getDocs, 
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// 🔹 Typing Effect Component (unchanged)
const TypingEffect: React.FC<{ text?: string }> = ({ text = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    if (!text) return;
    setDisplayedText("");
    let i = 0;
    const intv = setInterval(() => {
      setDisplayedText((prev) =>
        i < text.length ? prev + text.charAt(i++) : (clearInterval(intv), prev)
      );
    }, 30);
    return () => clearInterval(intv);
  }, [text]);
  return <Text style={styles.profileInfo}>{displayedText}</Text>;
};

const RecommendationScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mood, setMood] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<{ mood: string; suggestion: string }[]>(
    []
  );
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  // 1) Watch auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      console.log("Auth state changed, user =", u?.uid || "null");
    });
    return () => unsubAuth();
  }, []);

  // 2) Once we have a user, attach the Firestore listener
  useEffect(() => {
    if (!user) {
      setChats([]);           // clear out old chats on sign‑out
      return;
    }
    const chatsRef = collection(db, "users", user.uid, "chats");
    const q = query(chatsRef, orderBy("timestamp", "desc"));
    const unsubSnap = onSnapshot(q, (snap) => {
      console.log("Got", snap.docs.length, "chat(s) for", user.uid);
      setChats(
        snap.docs.map((doc) => ({
          ...(doc.data() as any),
        }))
      );
    });
    return () => unsubSnap();
  }, [user]);

  const getSuggestion = async () => {
    if (!mood.trim()) {
      setSuggestion("Please enter how you're feeling.");
      return;
    }
    if (!user) {
      setSuggestion("You must be signed in to get a suggestion.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://tjray3403-pantherrecommendation.hf.space/suggest",
        { mood }
      );
      console.log("API response:", res.data);
      const newSug = `${res.data.suggested_activity}. ${res.data.additional_note}`;
      setSuggestion(newSug);

      // Save under users/{uid}/chats
      await addDoc(collection(db, "users", user.uid, "chats"), {
        mood,
        suggestion: newSug,
        timestamp: serverTimestamp(),
      });
      console.log("Saved chat for", user.uid);
    } catch (err: any) {
      console.error(err);
      setSuggestion("Error fetching suggestion.");
    } finally {
      setLoading(false);
    }
  };


  const deleteDocByRef = async (docRef: DocumentReference) => {
    try {
      await deleteDoc(docRef); // ✅ Use deleteDoc() here
      console.log("Deleted doc:", docRef.id);
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  return (

<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : undefined}
  style={{ flex: 1 }}
>

    <View style={{ flex: 1 }}>
  {/* Scrollable Chat Section */}
  <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ paddingBottom: 220 }} // reserve space for sticky bottom
  >
    <View style={styles.chatContainer}>
      {chats.slice().reverse().map((chat, index) => (
        <View key={index} style={styles.chatItem}>
          <Text style={[styles.chatMood, { textAlign: "right" }]}>{chat.mood}</Text>
          <Text style={styles.chatSuggestion}>{chat.suggestion}</Text>
        </View>
      ))}
    </View>
  </ScrollView> 

  
  {/* Sticky Input/Suggestion Panel */}
  {isPanelVisible && (
  <View style={[styles.bottomStickyPanel, { position: "relative" }]}>
    {/* Floating buttons inside the panel */}
    <View
      style={{
        position: "absolute",
        top: 10,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 10,
      }}
    >
      {/* Clear History */}
      <TouchableOpacity
        onPress={async () => {
          if (user) {
            if (
              window.confirm(
                "Are you sure you want to delete all chat history? Warning: This action cannot be undone."
              )
            ) {
              try {
                const chatsRef = collection(db, "users", user.uid, "chats");
                const snapshot = await getDocs(chatsRef);
                snapshot.docs.forEach((doc) => deleteDocByRef(doc.ref));
                setChats([]);
                console.log("All chats deleted for", user.uid);
              } catch (err) {
                console.error("Failed to delete chats:", err);
              }
            }
          } else {
            alert("You must be signed in to delete chat history.");
          }
        }}
        style={{
          backgroundColor: "#ff4d4d",
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Clear History</Text>
      </TouchableOpacity>

      {/* Toggle Panel */}
      <TouchableOpacity
        onPress={() => setIsPanelVisible(false)}
        style={{
          backgroundColor: "#eee",
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 16,
        }}
      >
        <Text style={{ fontSize: 18 }}>\/</Text>
      </TouchableOpacity>
    </View>

    {/* Scrollable content below floating buttons */}
    <View style={{ paddingTop: 60 }}>
      <TextInput
      value={mood}
      onChangeText={setMood}
      placeholder="I'm feeling..."
      placeholderTextColor="#888"
      style={styles.recommendation_input}
      />

      <TouchableOpacity style={styles.recommendation_button} onPress={getSuggestion}>
      <Text style={styles.buttonText}>Get Suggestion</Text>
      </TouchableOpacity>

      </View>
<ScrollView
      style={{ marginTop: 10 }} // leave space for buttons
      keyboardShouldPersistTaps="handled"
    >
      {loading ? (
      <ActivityIndicator size="large" color="#8A56AC" />
      ) : suggestion && !loading ? (
      <View style={styles.recommendation_suggestionBox}>
        <TypingEffect text={suggestion} />
      </View>
      ) : null}
    </ScrollView>
  </View>
)}

{!isPanelVisible && (
  <TouchableOpacity
    onPress={() => setIsPanelVisible(true)}
    style={{
      position: "absolute",
      bottom: 60, // adjust as needed above nav bar
      right: 20, // move to the bottom-right corner
      zIndex: 10,
      backgroundColor: "#fff",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    }}
  >
    <Text style={{ fontSize: 18 }}>/\</Text>
  </TouchableOpacity>
)}

</View>
</KeyboardAvoidingView>



  );
};

export default RecommendationScreen;
