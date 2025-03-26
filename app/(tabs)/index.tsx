import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { db } from "@/config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import moment from "moment";

interface ClassItem {
  id: string;
  name: string;
  startTime?: string;
  building?: string;
  imageUrl?: string;
  date?: string;
}

export default function HomeScreen() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [userName, setUserName] = useState<string | null>(null);
  const [nextClass, setNextClass] = useState<ClassItem | null>(null);

  useEffect(() => {
    //  Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  const fetchUserName = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      console.log("📄 Full user data:", userDoc.data()); // Show the actual data
      if (userDoc.exists()) {
        setUserName(userDoc.data()?.name || "User"); // Safely access "name"
      } else {
        setUserName("User"); // Default if no data
      }
    } catch (error) {
      console.error("❌ Error fetching user name:", error);
      setUserName("User");
    }
  };

  // Call fetchUserName when user is available
  useEffect(() => {
    if (user) {
      fetchUserName(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchNextClass = async () => {
      try {
        const userClassesRef = collection(db, `users/${user.uid}/classes`);
        const snapshot = await getDocs(userClassesRef);
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ClassItem[];

        const todayDate = moment().format("YYYY-MM-DD");
        const now = moment();

        //  Filter today's classes & find the next one
        const todaysClasses = data.filter((classItem) => {
          if (!classItem.startTime) return false; //  Ensure startTime exists
          return (
            (!classItem.date || classItem.date === todayDate) &&
            moment(classItem.startTime, "hh:mm A").isAfter(now)
          );
        });

        //  Sort and get the first upcoming class
        const sortedClasses = todaysClasses.sort((a, b) => {
          return moment(a.startTime, "hh:mm A").diff(
            moment(b.startTime, "hh:mm A")
          );
        });

        if (sortedClasses.length > 0) {
          setNextClass(sortedClasses[0]); //  Set next class
        } else {
          setNextClass(null); //  No upcoming classes
        }
      } catch (err) {
        console.error("❌ Error fetching next class:", err);
      }
    };

    fetchNextClass();
  }, [user]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-start",
        paddingBottom: 20, // Add padding to prevent overlap at the bottom
      }}
      style={[styles.container, { minHeight: "100vh", overflowY: "scroll" }]} // Use overflowY: "scroll" for web scrolling
    >
      <Image
        source={require("../../assets/images/panther-pace-logo-clear.png")}
        style={styles.logo}
      />
      <Text style={styles.greeting}>Hi, {userName || "Student"}!</Text>

      {/*<Text style={styles.profileInfo}>Welcome to the Panther Pace App!</Text>

      <Link style={styles.link} href={"/(tabs)/weather"}>
        <Text style={styles.linkText}>Weather</Text>
      </Link>
        */}

      {/* Display the next class */}
      {nextClass ? (
        <TouchableOpacity
          style={styles.classCard}
          onPress={() => router.push(`/class/list_classes_screen`)}
        >
          <Image
            source={
              nextClass.imageUrl
                ? { uri: nextClass.imageUrl }
                : require("@/pantherpace_logo.jpg")
            }
            style={styles.classImage}
          />
          <View style={styles.classInfoContainer}>
            <Text style={styles.className}>{nextClass.name}</Text>
            <Text style={styles.classTime}>
              🕒 {nextClass.startTime || "No Time Set"}
            </Text>
            <Text style={styles.classBuilding}>
              📍 {nextClass.building || "Unknown Building"}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        // If no upcoming classes, show a message & options
        <View style={styles.noClassContainer}>
          <Text style={styles.noClassText}>No upcoming classes today.</Text>

          {/* Add Class Button */}
          <TouchableOpacity
            style={styles.addClassButton}
            onPress={() => router.push("/class/add_class_screen")}
          >
            <Text style={styles.buttonText}>➕ Add a Class</Text>
          </TouchableOpacity>

          {/* View All Classes Button */}
          <TouchableOpacity
            style={styles.viewClassesButton}
            onPress={() => router.push("/class/list_classes_screen")}
          >
            <Text style={styles.buttonText}>📚 View Classes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/*<TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity> */}
      <View
        style={[
          styles.buttonsContainer,
          {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
          },
        ]}
      >
        <View style={styles.weatherContainer}>
          <Text style={styles.containerButtonText}>Weather</Text>
          <Link style={styles.weatherTile} href={"/(tabs)/weather"}>
            <Image
              source={require("../../assets/images/weatherButtonIcon.png")}
              style={[
                styles.icon,
                { width: "100%", height: "100%", borderRadius: 30 },
              ]} // Adjusted size to fill the circle
            />
          </Link>
        </View>

        <View style={styles.waterContainer}>
          <Text style={styles.containerButtonText}>Water</Text>
          <Link style={styles.waterTile} href={"/(tabs)/weather"}>
            <Image
              source={require("../../assets/images/weatherButtonIcon.png")}
              style={[
                styles.icon,
                { width: "100%", height: "100%", borderRadius: 30 },
              ]} // Adjusted size to fill the circle
            />
          </Link>
        </View>

        <View style={styles.stepsContainer}>
          <Text style={styles.containerButtonText}>Steps</Text>
          <Link style={styles.stepsTile} href={"/(tabs)/weather"}>
            <Image
              source={require("../../assets/images/weatherButtonIcon.png")}
              style={[
                styles.icon,
                { width: "100%", height: "100%", borderRadius: 30 },
              ]} // Adjusted size to fill the circle
            />
          </Link>
        </View>

        <View style={styles.sleepContainer}>
          <Text style={styles.containerButtonText}>Sleep</Text>
          <Link style={styles.sleepTile} href={"/(tabs)/weather"}>
            <Image
              source={require("../../assets/images/weatherButtonIcon.png")}
              style={[
                styles.icon,
                { width: "100%", height: "100%", borderRadius: 30 },
              ]} // Adjusted size to fill the circle
            />
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

//  Integrated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Sky blue background color
    padding: 16,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    position: "absolute", // Position the logo absolutely
    top: 10, // Add some spacing from the top
    right: 10, // Add some spacing from the right
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left", // Align text to the left
    alignSelf: "flex-start", // Align greeting to the left
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center align text
  },
  profileInfo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center", // Center align text
  },
  link: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: "center", // Center align link
  },
  containerButtonText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center", // Center align text
    bottom: 3,
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: "90%",
    marginBottom: 20,
    alignSelf: "center", // Center align card
  },
  classImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "cover",
  },
  classInfoContainer: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left", // Align text to the left
  },
  classTime: {
    fontSize: 14,
    color: "#666",
    textAlign: "left", // Align text to the left
  },
  classBuilding: {
    fontSize: 14,
    color: "#666",
    textAlign: "left", // Align text to the left
  },
  noClassContainer: {
    alignItems: "center", // Center align container
    marginTop: 20,
  },
  noClassText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 10,
    textAlign: "center", // Center align text
  },
  addClassButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: "center", // Center align button
  },
  viewClassesButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    // Center align button
  },
  primaryButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: {
    position: "absolute", // Position the container absolutely
    bottom: 10, // Align it to the bottom of the screen
    alignSelf: "center", // Center the container horizontally
    width: "100%", // Take up all the width of the screen
    height: "50%",
    borderRightWidth: 1,
    borderRightColor: "black",
    borderLeftWidth: 1,
    borderLeftColor: "black",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderTopColor: "black",
  },
  weatherContainer: {
    position: "absolute",
    bottom: 30,
    right: 40,
  },
  weatherTile: {
    width: 120, // Increased width
    height: 120, // Increased height
    backgroundColor: "#87ceeb",
    borderRadius: 60, // Make it circular by setting borderRadius to half of width/height
    padding: 15,
    alignItems: "center",
    justifyContent: "center", // Center content inside the circle
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  waterContainer: {
    position: "absolute",
    bottom: 30,
    left: 40,
  },
  waterTile: {
    width: 120, // Increased width
    height: 120, // Increased height
    backgroundColor: "#87ceeb",
    borderRadius: 60, // Make it circular by setting borderRadius to half of width/height
    padding: 15,
    alignItems: "center",
    justifyContent: "center", // Center content inside the circle
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  stepsContainer: {
    position: "absolute",
    top: 30,
    left: 40,
  },
  stepsTile: {
    width: 120, // Increased width
    height: 120, // Increased height
    backgroundColor: "#87ceeb",
    borderRadius: 60, // Make it circular by setting borderRadius to half of width/height
    padding: 15,
    alignItems: "center",
    justifyContent: "center", // Center content inside the circle
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  sleepContainer: {
    position: "absolute",
    top: 30,
    right: 40,
  },
  sleepTile: {
    width: 120, // Increased width
    height: 120, // Increased height
    backgroundColor: "#87ceeb",
    borderRadius: 60, // Make it circular by setting borderRadius to half of width/height
    padding: 15,
    alignItems: "center",
    justifyContent: "center", // Center content inside the circle
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
});
