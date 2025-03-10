import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Button } from 'react-native';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

interface ClassItem {
  id: string;
  name: string;
  imageUrl?: string;
  professor?: string;
  building?: string;
  roomNumber?: string;
}

const ListClassesScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [editMode, setEditMode] = useState(false); // ✅ Tracks if user is in "Edit Mode"

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
        setClasses(data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };

    fetchClasses();
  }, [user]);

  const handleClassSelect = (classId: string) => {
    if (editMode) {
      router.push(`/class/edit_class_screen?classId=${classId}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Classes</Text>
        <View style={styles.buttonContainer}>
          <Button title="Add Class" onPress={() => router.push('/class/add_class_screen')} />
          {editMode ? (
            <Button title="Cancel" onPress={() => setEditMode(false)} color="red" />
          ) : (
            <Button title="Edit Classes" onPress={() => setEditMode(true)} />
          )}
        </View>
      </View>

      {/* List of Classes */}
      <FlatList
        data={classes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, editMode && styles.selectableCard]} // ✅ Highlights when in edit mode
            onPress={() => handleClassSelect(item.id)}
            disabled={!editMode} // ✅ Only selectable when in edit mode
          >
            <Image
           //
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
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
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
  },
  selectableCard: {
    borderWidth: 2, // ✅ Highlights cards in edit mode
    borderColor: 'blue',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classSubInfo: {
    fontSize: 14,
    color: '#888',
  },
});
