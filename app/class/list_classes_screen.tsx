// ✅ list_classes_screen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Button, Platform } from 'react-native';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import moment from 'moment';

interface ClassItem {
  id: string;
  name: string;
  imageUrl?: string;
  professor?: string;
  building?: string;
  roomNumber?: string;
  startTime: string;
  date?: string;
}

const ListClassesScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      try {
        const userClassesRef = collection(db, `users/${user.uid}/classes`);
        const snapshot = await getDocs(userClassesRef);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClassItem[];

        const todayDate = moment().format('YYYY-MM-DD');
        const todaysClasses = data.filter(classItem => {
          return !classItem.date || classItem.date === todayDate;
        });

        const sortedClasses = todaysClasses.sort((a, b) => {
          const timeA = moment(a.startTime, "hh:mm A");
          const timeB = moment(b.startTime, "hh:mm A");
          return timeA.diff(timeB);
        });

        setClasses(sortedClasses);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };

    fetchClasses();
  }, [user]);

  const handleClassSelect = (classId: string) => {
    if (editMode) {
      router.push(`/class/edit_class_screen?classId=${classId}`);
    } else {
      router.push(`/class/class_detail_screen?classId=${classId}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={styles.backButton}>← Home</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Classes</Text>

      <View style={styles.buttonContainer}>
        <Button title="Add Class" onPress={() => router.push('/class/add_class_screen')} />
        {editMode ? (
          <Button title="Cancel" onPress={() => setEditMode(false)} color="red" />
        ) : (
          <Button title="Edit Classes" onPress={() => setEditMode(true)} />
        )}
      </View>

      <FlatList
        data={classes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, editMode && styles.selectableCard]}
            onPress={() => handleClassSelect(item.id)}
          >
            <Image
              source={item.imageUrl ? { uri: item.imageUrl } : require('@/pantherpace_logo.jpg')}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.className}>{item.name}</Text>
              {item.professor && <Text style={styles.classSubInfo}>{item.professor}</Text>}
              <Text style={styles.classSubInfo}>{item.building}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ListClassesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    ...Platform.select({
      web: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  selectableCard: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classSubInfo: {
    fontSize: 14,
    color: '#888',
  },
  backButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
