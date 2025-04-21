import { styles } from "../../config/styles";
import React, { useState, useEffect } from "react";
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
    }, 50);
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

  return (
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

  {/* Toggle Button */}
  <TouchableOpacity
    onPress={() => setIsPanelVisible(!isPanelVisible)}
    style={{
      position: "absolute",
      bottom: isPanelVisible ? 200 : 0,
      left: 20, // ← change to left side like your image
      zIndex: 10,
      padding: 8,
      backgroundColor: "#fff",
      borderRadius: 20,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    }}
  >
    <Text style={{ fontSize: 18 }}>{isPanelVisible ? "\\/" : "/\\"}</Text>
  </TouchableOpacity>

  {/* Sticky Input/Suggestion Panel */}
  {isPanelVisible && (
    <View style={styles.bottomStickyPanel}>
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

      {loading ? (
      <ActivityIndicator size="large" color="#8A56AC" />
      ) : suggestion && !loading ? (
      <View style={styles.recommendation_suggestionBox}>
        <TypingEffect text={suggestion} />
      </View>
      ) : null}
    </View>
  )}
</View>

  );
};

export default RecommendationScreen;
