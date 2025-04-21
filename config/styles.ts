import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6A0DAD",
    marginBottom: 5,
  },
  profileInfo: {
    fontSize: 18,
    marginBottom: 5,
    color: "#000",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6A0DAD",
  },
  primaryButton: {
    marginTop: 20,
    width: 170,
    paddingVertical: 15,
    height: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#F1D4F9", //5D0170 darkest purple
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#6A0DAD",
  },
  logoutButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#A67C00",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  link: {
    color: "#6A0DAD",
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
  },

  weatherContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6A0DAD",
  },
  weatherContainerInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    fontSize: 20,
  },

  textWeather: {
    fontSize: 20,
  },
  infoWeather: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A0DAD",
  },

  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    width: "100%",
  },

  footerText: {
    fontSize: 18,
    color: "#000",
  },
  footerLink: {
    color: "#10B4FA",
    fontSize: 18,
    fontWeight: "600",
    padding: 5,
    textDecorationLine: "underline",
  },
  formContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#A6A6A6",
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
    outlineColor: "transparent",
    outlineWidth: 0,
  },
  logoLogin: {
    width: 285,
    height: 116,
  },
  linkButton: {
    marginTop: 12,
    marginBottom: 4,
  },
  
  linkText: {
    fontSize: 16,
    color: "#007AFF", // standard iOS-style link
    fontWeight: "500",
  },
  
});
