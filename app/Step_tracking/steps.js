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
import { auth, db } from "../../config/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";

export default function Steps() {
  const [PedometerAvailability, setPedometerAvailability] = useState("");
  const [stepCount, updateStepCount] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [inputGoal, setInputGoal] = useState("");
  const [userId, setUserId] = useState("");

  const stepLengthInMeters = 0.762;
  const distanceCoveredInMiles = (
    (stepCount * stepLengthInMeters) / 1609.34
  ).toFixed(2);

  // Get current logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  // Pedometer subscription
  useEffect(() => {
    const subscription = Pedometer.watchStepCount((result) => {
      updateStepCount(result.steps);
    });

    Pedometer.isAvailableAsync().then(
      (result) => setPedometerAvailability(String(result)),
      (error) => setPedometerAvailability("Error: " + error?.message)
    );

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!userId) return;
    const date = format(new Date(), "yyyy-MM-dd");
    const ref = doc(db, "users", userId, "dailyStats", date);

    const syncSteps = async () => {
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        await updateDoc(ref, {
          stepCount,
          stepGoal,
        });
      } else {
        await setDoc(ref, {
          stepCount,
          stepGoal,
        });
      }
    };

    syncSteps();
  }, [stepCount, stepGoal, userId]);

  const handleSetGoal = () => {
    const numericGoal = Number(inputGoal);
    if (isNaN(numericGoal) || numericGoal <= 0) {
      Alert.alert("Invalid Input", "Enter a valid number for the step goal.");
    } else {
      setStepGoal(numericGoal);
      Alert.alert("Step Goal Updated", `New step goal: ${numericGoal}`);
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>Step Tracker!</Text>
        <CircularProgress
          value={stepCount}
          maxValue={stepGoal}
          radius={100}
          textColor={"#000"}
          activeStrokeColor={"#96ef7a"}
          inActiveStrokeColor={"#d3d3d3"}
          inActiveStrokeOpacity={0.5}
          activeStrokeWidth={15}
          inActiveStrokeWidth={15}
        >
          <Image
            source={require("../../assets/images/running-fast.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </CircularProgress>
        <Text style={styles.text}>Steps: {stepCount}</Text>
        <Text style={styles.text}>Goal: {stepGoal} steps</Text>
        <Text style={styles.text}>Distance: {distanceCoveredInMiles} miles</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your step goal"
          keyboardType="numeric"
          value={inputGoal}
          onChangeText={setInputGoal}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Button title="Set Step Goal" onPress={handleSetGoal} />
        <StatusBar style="dark" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 16, color: "#000", fontWeight: "bold", textAlign: "center", marginVertical: 10 },
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
  image: { width: 80, height: 80 },
});
