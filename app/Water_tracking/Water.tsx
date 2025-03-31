import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from "react-native"; // Import Image from react-native
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from 'react-native-progress';

const WaterTracking = () => {
  const [totalWater, setTotalWater] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [goalInput, setGoalInput] = useState<string>("");
  const [dailyGoal, setDailyGoal] = useState<number>(2); // Default to 2 liters

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedWater = await AsyncStorage.getItem("totalWater");
        const savedGoal = await AsyncStorage.getItem("dailyGoal");

        if (savedWater !== null) {
          setTotalWater(parseFloat(savedWater));
        }
        if (savedGoal !== null) {
          setDailyGoal(parseFloat(savedGoal));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Save water data to AsyncStorage
  const saveWaterData = async (newTotal: number) => {
    try {
      await AsyncStorage.setItem("totalWater", newTotal.toString());
    } catch (error) {
      console.error("Error saving water data:", error);
    }
  };

  // Save goal data to AsyncStorage
  const saveGoalData = async (newGoal: number) => {
    try {
      await AsyncStorage.setItem("dailyGoal", newGoal.toString());
    } catch (error) {
      console.error("Error saving goal data:", error);
    }
  };

  // Handle adding water
  const addWater = () => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      const newTotal = totalWater + parsedValue;
      setTotalWater(newTotal);
      saveWaterData(newTotal);
      setInputValue("");
    } else {
      Alert.alert("Invalid Input", "Please enter a valid number greater than 0.");
    }
  };

  // Handle subtracting water
  const subtractWater = () => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      const newTotal = Math.max(totalWater - parsedValue, 0); // Ensure totalWater doesn't go below 0
      setTotalWater(newTotal);
      saveWaterData(newTotal);
      setInputValue("");
    } else {
      Alert.alert("Invalid Input", "Please enter a valid number greater than 0.");
    }
  };

  // Set a new daily goal
  const setGoal = () => {
    const parsedGoal = parseFloat(goalInput);
    if (!isNaN(parsedGoal) && parsedGoal > 0) {
      setDailyGoal(parsedGoal);
      saveGoalData(parsedGoal);
      setGoalInput("");
      Alert.alert("Goal Set", `Your daily goal is now ${parsedGoal} liters.`);
    } else {
      Alert.alert("Invalid Goal", "Please enter a valid number greater than 0.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Tracker</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.totalText}>
          Total Water Consumed Today: {totalWater.toFixed(2)} Ounces
        </Text>
        <View style={styles.progressWrapper}>
          <Progress.Circle
            progress={Math.min(totalWater / dailyGoal, 1)} // Ensure progress doesn't exceed 1
            size={180} // Adjust the size of the circle
            thickness={8} // Adjust the thickness of the circle
            color="#3b9d9b"
            borderWidth={0}
            showsText={false} // Disable default text inside the circle
          />
          {/* Add the image in the center */}
          <Image
            source={require("../../assets/images/water.jpg")} // Replace with your image path
            style={styles.progressImage}
          />
        </View>
        <Text style={styles.goalText}>
          {totalWater.toFixed(2)} / {dailyGoal} Ounces
        </Text>
        {totalWater >= dailyGoal && (
          <Text style={styles.congratsText}>You met your water intake goal!🎉</Text>
        )}
      </View>

      {/* Set Daily Goal Section */}
      <Text style={styles.subtitle}>Set Your Daily Goal (Ounces)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your daily goal"
        keyboardType="numeric"
        value={goalInput}
        onChangeText={setGoalInput}
        returnKeyType="done" // Adds a "Done" button on iOS
        onSubmitEditing={setGoal} // Calls the setGoal function when "Done" is pressed
      />
      <Button title="Set Goal" onPress={setGoal} />

      {/* Add Water Section */}
      <Text style={styles.subtitle}>Track Your Water Intake</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter water in liters (e.g., 0.5)"
        keyboardType="numeric"
        value={inputValue}
        onChangeText={setInputValue}
        returnKeyType="done" // Adds a "Done" button on iOS
        onSubmitEditing={addWater} // Calls the addWater function when "Done" is pressed
      />
      <Button title="Add Water" onPress={addWater} />
      <Button title="Subtract Water" onPress={subtractWater} /> {/* New button */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  progressContainer: {
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  progressWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  progressImage: {
    position: "absolute", // Overlay the image in the center
    width: 165, // Slightly smaller than the circle size (100 - 2 * thickness)
    height: 165, // Match the width for a square image
    borderRadius: 100, // Make the image circular (half of the width/height)
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b9d9b",
  },
  congratsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b9d9b",
    marginTop: 10,
  },
});

export default WaterTracking;
