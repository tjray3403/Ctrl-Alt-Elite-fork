import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';

interface ClassData {
  name: string;
  imageUrl?: string;
  professor?: string;
  building?: string;
  roomNumber?: string;
  note?: string;
}

const ClassDetailScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const { classId } = useLocalSearchParams(); // ✅ Correct way to get classId
  const [classData, setClassData] = useState<ClassData | null>(null);

  useEffect(() => {
    if (!user || !classId) return;

    const fetchClass = async () => {
      try {
        const docRef = doc(db, `users/${user.uid}/classes/${classId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClassData(docSnap.data() as ClassData);
        } else {
          console.error('Class not found');
        }
      } catch (err) {
        console.error('Error fetching class:', err);
      }
    };

    fetchClass();
  }, [user, classId]);

  if (!classData) {
    return (
      <View style={styles.container}>
        <Text>Loading class details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top image / banner */}
      <Image
       // source={classData.imageUrl ? { uri: classData.imageUrl } : require('@/assets/placeholder.png')}
        style={styles.bannerImage}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.classTitle}>{classData.name}</Text>
        {classData.professor && <Text style={styles.classInfo}>Professor: {classData.professor}</Text>}
        <Text style={styles.classInfo}>Building: {classData.building}</Text>
        {classData.roomNumber && <Text style={styles.classInfo}>Room: {classData.roomNumber}</Text>}

        {/* Notes */}
        {classData.note && (
          <View style={styles.noteContainer}>
            <Text style={styles.subtitle}>Note:</Text>
            <Text style={styles.noteText}>{classData.note}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ClassDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  classInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteContainer: {
    marginTop: 12,
  },
  noteText: {
    fontSize: 14,
    marginTop: 4,
  },
});
