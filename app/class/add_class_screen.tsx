import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { db } from '@/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';


const AddClassScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [building, setBuilding] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddClass = async () => {
    if (!user) {
      setError('You must be logged in to add a class.');
      return;
    }

    if (!name || !building) {
      setError('Please fill out at least the Class Name and Building.');
      return;
    }

    try {
      // Reference to the user's classes subcollection
      const userClassesRef = collection(db, `users/${user.uid}/classes`);

      // Add the new class document under the user's Firestore document
      await addDoc(userClassesRef, {
        name,
        professor: professor || null, // Optional
        building,
        roomNumber: roomNumber || null, // Optional
        imageUrl: imageUrl || null, // Optional
        note: note || null, // Optional
        createdAt: serverTimestamp(),
      });

      // Clear inputs
      setName('');
      setProfessor('');
      setBuilding('');
      setRoomNumber('');
      setImageUrl('');
      setNote('');
      setError('');

      alert('Class added successfully!');

      setTimeout(() => {
        router.push('/class/list_classes_screen');
      }, 100);
    } catch (err) {
      console.error('Error adding class:', err);
      setError('Could not add class. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Class Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Professor (Optional)</Text>
      <TextInput style={styles.input} value={professor} onChangeText={setProfessor} />

      <Text style={styles.label}>Building *</Text>
      <TextInput style={styles.input} value={building} onChangeText={setBuilding} />

      <Text style={styles.label}>Room Number (Optional)</Text>
      <TextInput style={styles.input} value={roomNumber} onChangeText={setRoomNumber} />

      <Text style={styles.label}>Image URL (Optional)</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />

      <Text style={styles.label}>Note (Optional)</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Add Class" onPress={handleAddClass} />
    </ScrollView>
  );
};

export default AddClassScreen;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginTop: 4 },
  error: { color: 'red', marginVertical: 8 },
});
