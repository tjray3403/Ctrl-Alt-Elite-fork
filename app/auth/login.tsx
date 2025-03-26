import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useRouter } from "expo-router";
import { auth } from "../../config/firebase";
import { styles } from "../../config/styles";
import Svg, { Path } from "react-native-svg";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("❌ Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/profile");
    } catch (error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === "auth/user-not-found") {
        setErrorMessage("❌ No account found with this email.");
      } else if (firebaseError.code === "auth/wrong-password") {
        setErrorMessage("❌ Incorrect password. Try again.");
      } else {
        setErrorMessage("❌ Login failed. Please check your credentials.");
      }
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
          <Svg width="30" height="25" viewBox="0 0 85 80">
            <Path
              d="M 81.956 77.972 H 8.044 C 3.608 77.972 0 74.363 0 69.928 V 20.072 c 0 -4.435 3.608 -8.043 8.044 -8.043 h 73.912 c 4.436 0 8.044 3.608 8.044 8.043 v 49.855 C 90 74.363 86.392 77.972 81.956 77.972 z M 8.044 14.029 C 4.711 14.029 2 16.74 2 20.072 v 49.855 c 0 3.333 2.711 6.044 6.044 6.044 h 73.912 c 3.333 0 6.044 -2.711 6.044 -6.044 V 20.072 c 0 -3.333 -2.711 -6.043 -6.044 -6.043 H 8.044 z"
              fill="black"
            />
            <Path
              d="M 45 54.395 c -0.242 0 -0.485 -0.088 -0.676 -0.263 L 2.531 15.79 c -0.407 -0.373 -0.435 -1.006 -0.061 -1.413 c 0.373 -0.407 1.006 -0.436 1.413 -0.061 L 45 52.037 l 41.118 -37.721 c 0.405 -0.374 1.039 -0.347 1.413 0.061 c 0.373 0.407 0.346 1.04 -0.062 1.413 L 45.676 54.132 C 45.485 54.307 45.242 54.395 45 54.395 z"
              fill="black"
            />
            <Path
              d="M 15.948 64.258 c -0.271 0 -0.54 -0.109 -0.737 -0.324 c -0.374 -0.406 -0.346 -1.039 0.061 -1.413 l 19.902 -18.257 c 0.407 -0.375 1.039 -0.346 1.413 0.061 c 0.374 0.407 0.346 1.04 -0.061 1.413 L 16.624 63.995 C 16.432 64.171 16.189 64.258 15.948 64.258 z"
              fill="black"
            />
            <Path
              d="M 74.053 64.258 c -0.242 0 -0.484 -0.087 -0.676 -0.263 L 53.475 45.737 c -0.407 -0.373 -0.435 -1.006 -0.062 -1.413 c 0.374 -0.409 1.008 -0.435 1.413 -0.061 l 19.902 18.257 c 0.407 0.374 0.435 1.006 0.062 1.413 C 74.593 64.148 74.323 64.258 74.053 64.258 z"
              fill="black"
            />
          </Svg>

          <TextInput
            style={styles.input}
            placeholderTextColor={"#A6A6A6"}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Svg width="30" height="25" viewBox="0 0 1024 1024">
            <Path
              d="M779.822 367.987h-10.317V272.55C770.365 116.93 657.733 0 508.99 0 362.828 0 251.056 116.93 251.056 272.55v95.437h-7.738c-78.24 0-141.004 66.203-141.004 143.583v367.987c0 80.82 63.624 143.583 141.004 143.583h536.504c78.24 0 141.004-66.203 141.004-143.583V511.57c-1.72-79.96-65.343-143.583-141.004-143.583zM294.905 270.83c0-134.126 90.277-228.702 214.086-228.702 126.388 0 216.665 97.156 216.665 228.702v95.436h-433.33v-95.436h2.58z m582.932 608.726c0 55.885-43.849 102.314-97.155 102.314H243.318c-53.306 0-97.155-46.429-97.155-102.314V511.57c0-55.886 43.849-102.314 97.155-102.314h537.364c53.306 0 97.155 46.428 97.155 102.314v367.987z"
              fill="black"
            />
            <Path
              d="M507.271 567.456c-34.391 0-61.044 29.232-61.044 63.624 0 24.074 12.037 43.849 31.812 55.886v104.893c0 17.196 14.616 31.812 31.812 31.812s31.811-14.616 31.811-31.812V686.966c19.775-12.037 31.812-31.812 31.812-55.886-6.018-33.532-32.671-63.624-66.203-63.624z"
              fill="black"
            />
          </Svg>

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#A6A6A6"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.primaryButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href="/auth/signup" style={styles.footerLink}>
          <Text style={styles.footerLink}>Create account</Text>
        </Link>
      </View>
    </View>
  );
}
