import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';

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
  const [nextClass, setNextClass] = useState<ClassItem | null>(null);

  useEffect(() => {
    //  Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchNextClass = async () => {
      try {
        const userClassesRef = collection(db, `users/${user.uid}/classes`);
        const snapshot = await getDocs(userClassesRef);
        let data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClassItem[];

        const todayDate = moment().format('YYYY-MM-DD');
        const now = moment();

        //  Filter today's classes & find the next one
        const todaysClasses = data.filter(classItem => {
          if (!classItem.startTime) return false; //  Ensure startTime exists
          return (!classItem.date || classItem.date === todayDate) &&
                 moment(classItem.startTime, "hh:mm A").isAfter(now);
        });

        //  Sort and get the first upcoming class
        const sortedClasses = todaysClasses.sort((a, b) => {
          return moment(a.startTime, "hh:mm A").diff(moment(b.startTime, "hh:mm A"));
        });

        if (sortedClasses.length > 0) {
          setNextClass(sortedClasses[0]); //  Set next class
        } else {
          setNextClass(null); //  No upcoming classes
        }
      } catch (err) {
        console.error('❌ Error fetching next class:', err);
      }
    };

    fetchNextClass();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Home</Text>
      <Text style={styles.profileInfo}>Welcome to the Panther Pace App!</Text>

      <Link style={styles.link} href={"/(tabs)/weather"}>
        <Text style={styles.linkText}>Weather☁️</Text>
      </Link>
      <Link style={styles.link} href={"/Water_tracking/Water"}>
        <Text style={styles.linkText}>Water Tracker💧</Text>
      </Link>
      <Link style={styles.link} href={"/Step_tracking/steps"}>
        <Text style={styles.linkText}>Step Tracker👣</Text>
      </Link>

      {/*  Display the next class */}
      {nextClass ? (
        <TouchableOpacity 
          style={styles.classCard} 
          onPress={() => router.push(`/class/list_classes_screen`)}
        >
          <Image 
            source={nextClass.imageUrl ? { uri: nextClass.imageUrl } : require('../../assets/images/pantherpace_logo.PNG')} 
            style={styles.classImage} 
          />
          <View style={styles.classInfoContainer}>
            <Text style={styles.className}>{nextClass.name}</Text>
            <Text style={styles.classTime}>🕒 {nextClass.startTime || "No Time Set"}</Text>
            <Text style={styles.classBuilding}>📍 {nextClass.building || "Unknown Building"}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        //  If no upcoming classes, show a message & options
        <View style={styles.noClassContainer}>
          <Text style={styles.noClassText}>No upcoming classes today.</Text>
          
          {/*  Add Class Button */}
          <TouchableOpacity 
            style={styles.addClassButton} 
            onPress={() => router.push('/class/add_class_screen')}
          >
            <Text style={styles.buttonText}>➕ Add a Class</Text>
          </TouchableOpacity>

          {/*  View All Classes Button */}
          <TouchableOpacity 
            style={styles.viewClassesButton} 
            onPress={() => router.push('/class/list_classes_screen')}
          >
            <Text style={styles.buttonText}>📚 View Classes</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

//  Integrated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
    marginBottom: 20,
  },
  classImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  classInfoContainer: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  classTime: {
    fontSize: 14,
    color: '#666',
  },
  classBuilding: {
    fontSize: 14,
    color: '#666',
  },
  noClassContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noClassText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  addClassButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  viewClassesButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  primaryButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

