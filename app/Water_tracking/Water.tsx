import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";

const WaterTracking = () => {
  const [totalWater, setTotalWater] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [goalInput, setGoalInput] = useState<string>("");
  const [dailyGoal, setDailyGoal] = useState<number>(2);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedWater = await AsyncStorage.getItem("totalWater");
        const savedGoal = await AsyncStorage.getItem("dailyGoal");

        if (savedWater !== null) setTotalWater(parseFloat(savedWater));
        if (savedGoal !== null) setDailyGoal(parseFloat(savedGoal));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const date = format(new Date(), "yyyy-MM-dd");
    const ref = doc(db, "users", userId, "dailyStats", date);

    const syncWater = async () => {
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        await updateDoc(ref, {
          waterIntake: totalWater,
          waterGoal: dailyGoal,
        });
      } else {
        await setDoc(ref, {
          waterIntake: totalWater,
          waterGoal: dailyGoal,
        });
      }
    };

    syncWater();
  }, [totalWater, dailyGoal, userId]);

  const saveWaterData = async (newTotal: number) => {
    try {
      await AsyncStorage.setItem("totalWater", newTotal.toString());
    } catch (error) {
      console.error("Error saving water data:", error);
    }
  };

  const saveGoalData = async (newGoal: number) => {
    try {
      await AsyncStorage.setItem("dailyGoal", newGoal.toString());
    } catch (error) {
      console.error("Error saving goal data:", error);
    }
  };

  const addWater = () => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      const newTotal = totalWater + parsedValue;
      setTotalWater(newTotal);
      saveWaterData(newTotal);
      setInputValue("");
    } else {
      Alert.alert("Invalid Input", "Enter a number greater than 0.");
    }
  };

  const subtractWater = () => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      const newTotal = Math.max(totalWater - parsedValue, 0);
      setTotalWater(newTotal);
      saveWaterData(newTotal);
      setInputValue("");
    } else {
      Alert.alert("Invalid Input", "Enter a number greater than 0.");
    }
  };

  const setGoal = () => {
    const parsedGoal = parseFloat(goalInput);
    if (!isNaN(parsedGoal) && parsedGoal > 0) {
      setDailyGoal(parsedGoal);
      saveGoalData(parsedGoal);
      setGoalInput("");
      Alert.alert("Goal Set", `Daily goal set to ${parsedGoal} liters.`);
    } else {
      Alert.alert("Invalid Goal", "Enter a valid number greater than 0.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Water Tracker</Text>

      <View style={styles.progressContainer}>
      <Text style={styles.totalText}>
        Total Water Today: {totalWater.toFixed(2)} Ounces
      </Text>
      <View style={styles.progressWrapper}>
        <Progress.Circle
        progress={Math.min(totalWater / dailyGoal, 1)}
        size={180}
        thickness={8}
        color="#3b9d9b"
        borderWidth={0}
        showsText={false}
        />
        <Image
        source={require("../../assets/images/panther_water.png")}
        style={styles.progressImage}
        />
      </View>
      <Text style={styles.goalText}>
        {totalWater.toFixed(2)} / {dailyGoal} Ounces
      </Text>
      {totalWater >= dailyGoal && (
        <Text style={styles.congratsText}>You met your water goal! 🎉</Text>
      )}
      </View>

      <Text style={styles.subtitle}>Set Your Daily Goal (Ounces)</Text>
      <TextInput
      style={styles.input}
      placeholder="Enter your daily goal"
      keyboardType="numeric"
      value={goalInput}
      onChangeText={setGoalInput}
      returnKeyType="done"
      onSubmitEditing={setGoal}
      />
      <Button title="Set Goal" onPress={setGoal} />

      <Text style={styles.subtitle}>Track Your Water Intake</Text>
      <TextInput
      style={styles.input}
      placeholder="Enter water in ounces (e.g., 8)"
      keyboardType="numeric"
      value={inputValue}
      onChangeText={setInputValue}
      returnKeyType="done"
      onSubmitEditing={addWater}
      />
      <Button title="Add Water" onPress={addWater} />
      <Button title="Subtract Water" onPress={subtractWater} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f2f2f2" },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, marginBottom: 15 },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  progressContainer: { marginTop: 20, width: "80%", alignItems: "center" },
  progressWrapper: { position: "relative", justifyContent: "center", alignItems: "center" },
  progressImage: {
    position: "absolute",
    width: 165,
    height: 165,
    borderRadius: 100,
  },
  totalText: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  goalText: { fontSize: 16, fontWeight: "600", color: "#3b9d9b" },
  congratsText: { fontSize: 16, fontWeight: "600", color: "#3b9d9b", marginTop: 10 },
});

export default WaterTracking;
