import { styles } from "../../config/styles";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import { collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db , auth} from "../../config/firebase"; // Ensure Firestore is initialized
// 🔹 Typing Effect Component
const TypingEffect: React.FC<{ text?: string }> = ({ text = "" }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return; 

    setDisplayedText(""); 
    let index = 0; 

    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < text.length) {
          return prev + text.charAt(index++); 
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 50); 

    return () => clearInterval(interval);
  }, [text]);

  return <Text style={styles.profileInfo}>{displayedText}</Text>;
};



const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.profileInfo}>{dots}</Text>;
};

const RecommendationScreen: React.FC = () => {
  const [mood, setMood] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [save_suggestion, saveSuggestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<{ mood: string; suggestion: string }[]>([]);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
  if (!currentUser) return;


    const q = query(
      collection(db, "chats"),
      where("userId", "==", currentUser.uid), 
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map((doc) => doc.data() as { mood: string; suggestion: string });
      setChats(fetchedChats);
    });
    return () => unsubscribe();
  }, []);

  const getSuggestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://tjray3403-pantherrecommendation.hf.space/suggest",
        { mood},
      );
      const newSuggestion = response.data.suggested_activity + ". " + response.data.additional_note;
      setSuggestion(newSuggestion);

      if (!newSuggestion) {
        throw new Error("No suggestion received from API.");
      }
    
      // Save mood and suggestion to Firestore
      await addDoc(collection(db, "chats"), {
        mood,
        suggestion: newSuggestion,
        userId: auth.currentUser?.uid,
        timestamp: new Date(),
      });

      console.log("API Response:", response.data);
    } catch (error) {
      console.error(error);
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

