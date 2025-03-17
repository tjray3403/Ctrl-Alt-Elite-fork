import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { Link, useRouter } from "expo-router";
import { styles } from "../../config/styles";
import Svg, { Path } from "react-native-svg";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), { name, email });

      Alert.alert("✅ Signup Success", "Account created successfully!");
      router.replace("/(tabs)/profile");
    } catch (error) {
      Alert.alert("❌ Signup Failed", (error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { paddingLeft: 0, marginLeft: 0 }]}
          placeholder="Name"
          placeholderTextColor={"#A6A6A6"}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { paddingLeft: 0, marginLeft: 0 }]}
          placeholder="Email"
          placeholderTextColor={"#A6A6A6"}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { paddingLeft: 0, marginLeft: 0 }]}
          placeholderTextColor={"#A6A6A6"}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity onPress={handleSignup} style={styles.primaryButton}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Link href="/auth/login" style={styles.footerLink}>
          <Text style={styles.footerLink}>Login</Text>
        </Link>
      </View>
    </View>
  );
}