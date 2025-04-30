import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Pedometer } from "expo-sensors";
import CircularProgress from "react-native-circular-progress-indicator";


import { Platform } from "react-native"; // add this at the top with other imports

export default function Steps() {
  const [PedometerAvailability, setPedometerAvailability] = useState("");
  const [stepCount, updateStepCount] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000); // Default goal is 10,000 steps
  const [inputGoal, setInputGoal] = useState(""); // Temporary state for user input

  // Approximate step length in meters
  const stepLengthInMeters = 0.762;

  // Calculate distance covered in miles
  const distanceCoveredInMiles = (
    (stepCount * stepLengthInMeters) /
    1609.34
  ).toFixed(2); // Convert to miles and round to 2 decimal places

  

useEffect(() => {
  let subscription = null;

  // Only try to use pedometer on native devices
  if (Platform.OS !== "web") {
    // Try to subscribe to step updates
    subscription = Pedometer.watchStepCount((result) => {
      updateStepCount(result.steps);
    });

    // Check if pedometer is available
    Pedometer.isAvailableAsync().then(
      (result) => {
        setPedometerAvailability(String(result));
      },
      (error) => {
        setPedometerAvailability("Error: " + (error.message || "Unknown error"));
      }
    );
  } else {
    // For web, skip tracking
    setPedometerAvailability("Not supported on web");
  }

  // Cleanup when component unmounts
  return () => {
    if (subscription) subscription.remove();
  };
}, []);

  const handleSetGoal = () => {
    const numericGoal = Number(inputGoal);
    if (isNaN(numericGoal) || numericGoal <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive number for the step goal.");
    } else {
      setStepGoal(numericGoal);
      Alert.alert("Step Goal Updated", `Your new step goal is ${numericGoal} steps.`);
      Keyboard.dismiss(); // Dismiss the keyboard after setting the goal
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>Step Tracker!</Text>
        <View>
          <CircularProgress
            value={stepCount}
            maxValue={stepGoal} // Dynamically set the goal
            radius={100}
            textColor={"#000"}
            activeStrokeColor={"#96ef7a"} // Color of the progress indicator
            inActiveStrokeColor={"#d3d3d3"} // Gray for inactive progress
            inActiveStrokeOpacity={0.5}
            activeStrokeWidth={15}
            inActiveStrokeWidth={15}
          >
            {/* Image in the center of the progress circle */}
            <Image
              source={require("../../assets/images/running-fast.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </CircularProgress>
        </View>
        <Text style={styles.text}>Steps: {stepCount}</Text>
        <Text style={styles.text}>Goal: {stepGoal} steps</Text>
        <Text style={styles.text}>Distance Covered: {distanceCoveredInMiles} miles</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your step goal"
          keyboardType="numeric"
          value={inputGoal}
          onChangeText={(text) => setInputGoal(text)} // Update the temporary input state
          onSubmitEditing={Keyboard.dismiss} // Dismiss the keyboard when the user presses "Done"
        />
        <Button title="Set Step Goal" onPress={handleSetGoal} />
        <StatusBar style="dark" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Center the circle in the screen
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "#6A0DAD",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 20,
    width: "80%",
    textAlign: "center",
  },
  image: {
    width: 80, // Adjust the size of the image
    height: 80,
  },
});

