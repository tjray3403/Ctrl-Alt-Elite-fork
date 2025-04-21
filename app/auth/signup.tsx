import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    setErrorMessage("");
    console.log("🟢 Register button clicked");
    if (!email || !password || !name) {
      setErrorMessage("❌ Please fill in all fields.");
      return;
    }

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
    } catch (error: any) {
      console.log("❌ Signup Error:", error);
      setErrorMessage(error.message || "❌ Signup failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <View style={{ marginBottom: 20 }}>
        <Image
          source={require("../../assets/images/panther-pace-logo-clear.png")}
          width={285}
          height={116}
          style={styles.logoLogin}
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          {/* Optional icon */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={"#A6A6A6"}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          {/* Optional icon */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#A6A6A6"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          {/* Optional icon */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#A6A6A6"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={handleSignup} style={styles.primaryButton}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Link href="/auth/login" style={styles.footerLink}>
          <Text style={styles.footerLink}>Login</Text>
        </Link>
      </View>
    </View>
  );
}
