import { styles } from "../../config/styles";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);

  const getSuggestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://tjray3403-pantherrecommendation.hf.space/suggest",
        { mood }
      );
      setSuggestion(response.data.suggested_activity);
    } catch (error) {
      console.error(error);
      setSuggestion("Error fetching suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <TextInput
        value={mood}
        onChangeText={setMood}
        placeholder="I'm feeling..."
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TouchableOpacity style={styles.recommendation_button} onPress={getSuggestion}>
        <Text style={styles.buttonText}>Get Suggestion</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#8A56AC" />
      ) : suggestion ? (
        <View style={styles.recommendation_suggestionBox}>
          <TypingEffect text={suggestion} />
        </View>
      ) : null}
    </View>
  );
};

export default RecommendationScreen;

