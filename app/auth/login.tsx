import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../../config/firebase";
import { styles } from "../../config/styles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Holds the error message

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous error message

    if (!email || !password) {
      setErrorMessage("❌ Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/tabs/profile");
    } catch (error) {
      console.error("❌ Login Error:", error);

      // ✅ Set specific error messages based on Firebase error codes
      if (error.code === "auth/user-not-found") {
        setErrorMessage("❌ No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("❌ Incorrect password. Try again.");
      } else {
        setErrorMessage("❌ Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/signup")} style={styles.secondaryButton}>
        <Text style={styles.buttonText}>Go to Signup</Text>
      </TouchableOpacity>
    </View>
  );
}
