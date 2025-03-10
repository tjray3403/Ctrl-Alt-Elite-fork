// AddClassScreen.tsx
import React, { useState } from 'react'
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native'
import { db } from '@/config/firebase'
import { collection, addDoc } from 'firebase/firestore'

const AddClassScreen: React.FC = () => {
  const [name, setName] = useState('')
  const [professor, setProfessor] = useState('')
  const [building, setBuilding] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [assignments, setAssignments] = useState('')
  const [note, setNote] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [error, setError] = useState('')

  const handleAddClass = async () => {
    // Basic validation
    if (!name || !professor || !building) {
      setError('Please fill out name, professor, and building at minimum.')
      return
    }

    try {
      await addDoc(collection(db, 'classes'), {
        name,
        professor,
        building,
        roomNumber,
        imageUrl,
        // Convert comma-separated assignments string into an array if needed
        assignments: assignments ? assignments.split(',').map(item => item.trim()) : [],
        note,
        location: {
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0
        },
        createdAt: new Date()
      })

      // Clear state or navigate away
      setName('')
      setProfessor('')
      setBuilding('')
      setRoomNumber('')
      setImageUrl('')
      setAssignments('')
      setNote('')
      setLatitude('')
      setLongitude('')
      setError('')
      alert('Class added successfully!')
    } catch (err) {
      console.error('Error adding class: ', err)
      setError('Could not add class. Please try again.')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Class Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Professor:</Text>
      <TextInput style={styles.input} value={professor} onChangeText={setProfessor} />

      <Text style={styles.label}>Building:</Text>
      <TextInput style={styles.input} value={building} onChangeText={setBuilding} />

      <Text style={styles.label}>Room Number:</Text>
      <TextInput style={styles.input} value={roomNumber} onChangeText={setRoomNumber} />

      <Text style={styles.label}>Image URL:</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />

      <Text style={styles.label}>Assignments (comma separated):</Text>
      <TextInput style={styles.input} value={assignments} onChangeText={setAssignments} />

      <Text style={styles.label}>Note:</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} />

      <Text style={styles.label}>Latitude:</Text>
      <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} keyboardType="numeric" />

      <Text style={styles.label}>Longitude:</Text>
      <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} keyboardType="numeric" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Add Class" onPress={handleAddClass} />
    </ScrollView>
  )
}

export default AddClassScreen

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginTop: 4 },
  error: { color: 'red', marginVertical: 8 },
})
