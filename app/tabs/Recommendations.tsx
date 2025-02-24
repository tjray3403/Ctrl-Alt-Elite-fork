
import { styles } from "../../config/styles";
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';


  const RecommendationScreen = () => {
    const [mood, setMood] = useState('');
    const [suggestion, setSuggestion] = useState('');
  
    const getSuggestion = async () => {
      try {
        const response = await axios.post('https://tjray3403-pantherrecommendation.hf.space/suggest', { mood }); 
        setSuggestion(response.data.suggested_activity);
      } catch (error) {
        console.error(error);
        setSuggestion("Error fetching suggestion.");
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>How are you feeling?</Text>
        <TextInput 
          value={mood}
          onChangeText={setMood}
          placeholder="Enter a mood (e.g., happy, stressed)"
          style={styles.profileInfo}
        />
        <Button title="Get Suggestion" onPress={getSuggestion} />
        <Text style={{ marginTop: 20 }}>{suggestion}</Text>
      </View>
    );
  };
  
  export default RecommendationScreen;


    /*<View style={styles.container}>
      <Text style={styles.title}>🌍 Explore</Text>
      <Text style={styles.profileInfo}>Discover new workouts and fitness tips.</Text>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Find New Workouts</Text>
      </TouchableOpacity>
    </View>
  );*/

