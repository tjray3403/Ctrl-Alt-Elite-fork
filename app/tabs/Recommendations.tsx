import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

const ActivitySuggestion = () => {
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const getSuggestion = async () => {
    try {
      const response = await axios.post('http://192.168.1.46:8000/suggest', { mood }); 
      setSuggestion(response.data.suggested_activity);
    } catch (error) {
      console.error(error);
      setSuggestion("Error fetching suggestion.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>How are you feeling?</Text>
      <TextInput 
        value={mood}
        onChangeText={setMood}
        placeholder="Enter a mood (e.g., happy, stressed)"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Get Suggestion" onPress={getSuggestion} />
      <Text style={{ marginTop: 20 }}>{suggestion}</Text>
    </View>
  );
};

export default ActivitySuggestion;
