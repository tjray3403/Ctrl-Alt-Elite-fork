import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Login() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/tabs"); // Navigate to main app (adjust as needed)
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/signup")}>
        <Text>Go to Signup</Text>
      </TouchableOpacity>
    </View>
  );
}
