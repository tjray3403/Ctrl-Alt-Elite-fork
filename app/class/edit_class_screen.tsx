import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { db } from '@/config/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';

interface ClassData {
  name: string;
  professor?: string;
  building: string;
  roomNumber?: string;
  imageUrl?: string;
  note?: string;
}

const EditClassScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const { classId } = useLocalSearchParams();
  const router = useRouter();

  const [classData, setClassData] = useState<ClassData>({
    name: '',
    professor: '',
    building: '',
    roomNumber: '',
    imageUrl: '',
    note: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !classId) return;

    const fetchClass = async () => {
      try {
        const docRef = doc(db, `users/${user.uid}/classes/${classId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClassData(docSnap.data() as ClassData);
        } else {
          Alert.alert('Error', 'Class not found');
          setTimeout(() => {
            router.push('/class/list_classes_screen');
          }, 100);
        }
      } catch (err) {
        console.error('Error fetching class:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [user, classId]);

  const handleUpdateClass = async () => {
    if (!user || !classId) return;

    try {
      const docRef = doc(db, `users/${user.uid}/classes/${classId}`);
      await updateDoc(docRef, { ...classData });

      Alert.alert('Success', 'Class updated successfully');
      setTimeout(() => {
        router.push('/class/list_classes_screen');
      }, 100);
    } catch (err) {
      console.error('Error updating class:', err);
      Alert.alert('Error', 'Could not update class');
    }
  };

  const handleDeleteClass = async () => {
    if (!user || !classId) return;

    Alert.alert('Confirm Delete', 'Are you sure you want to delete this class?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const docRef = doc(db, `users/${user.uid}/classes/${classId}`);
            await deleteDoc(docRef);

            Alert.alert('Deleted', 'Class removed successfully');
            setTimeout(() => {
                router.push('/class/list_classes_screen');
              }, 100);
          } catch (err) {
            console.error('Error deleting class:', err);
            Alert.alert('Error', 'Could not delete class');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading class data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Class Name</Text>
      <TextInput
        style={styles.input}
        value={classData.name}
        onChangeText={(text) => setClassData({ ...classData, name: text })}
      />

      <Text style={styles.label}>Professor (Optional)</Text>
      <TextInput
        style={styles.input}
        value={classData.professor || ''}
        onChangeText={(text) => setClassData({ ...classData, professor: text })}
      />

      <Text style={styles.label}>Building</Text>
      <TextInput
        style={styles.input}
        value={classData.building}
        onChangeText={(text) => setClassData({ ...classData, building: text })}
      />

      <Text style={styles.label}>Room Number (Optional)</Text>
      <TextInput
        style={styles.input}
        value={classData.roomNumber || ''}
        onChangeText={(text) => setClassData({ ...classData, roomNumber: text })}
      />

      <Text style={styles.label}>Image URL (Optional)</Text>
      <TextInput
        style={styles.input}
        value={classData.imageUrl || ''}
        onChangeText={(text) => setClassData({ ...classData, imageUrl: text })}
      />

      <Text style={styles.label}>Note (Optional)</Text>
      <TextInput
        style={styles.input}
        value={classData.note || ''}
        onChangeText={(text) => setClassData({ ...classData, note: text })}
      />

      <Button title="Update Class" onPress={handleUpdateClass} color="green" />
      <Button title="Delete Class" onPress={handleDeleteClass} color="red" />
    </ScrollView>
  );
};

export default EditClassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
});
