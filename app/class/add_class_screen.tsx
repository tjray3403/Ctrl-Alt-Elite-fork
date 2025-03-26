import React, { useState } from 'react';
import { 
  View, TextInput, Button, Text, ScrollView, StyleSheet, TouchableOpacity, Platform 
} from 'react-native';
import { db } from '@/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker'; //  Works for iOS & Android
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import {LocationName} from '../../config/building_names'
import ImagePickerInput from '@/components/imagePickerInput';


const AddClassScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [building, setBuilding] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [note, setNote] = useState('');
  const [startTime, setStartTime] = useState(''); //  Stores selected time
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const buildingOptions = Object.values(LocationName);

  //  Handles time selection across platforms
  const handleConfirmTime = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setSelectedDate(selectedTime);
      setStartTime(moment(selectedTime).format('hh:mm A')); //  Ensures standard "08:30 AM" format
    }
    setTimePickerVisible(false);
  };

  const handleAddClass = async () => {
    if (!user) {
      setError('You must be logged in to add a class.');
      return;
    }

    if (!name || !building || !startTime) {
      setError('Please fill out at least the Class Name, Building, and Start Time.');
      return;
    }

    try {
      const userClassesRef = collection(db, `users/${user.uid}/classes`);
      await addDoc(userClassesRef, {
        name,
        professor: professor || null, // Optional
        building,
        roomNumber: roomNumber || null, // Optional
        imageUrl: imageUrl || null, // Optional
        note: note || null, // Optional
        startTime, //  Stores formatted start time
        createdAt: serverTimestamp(), //  Uses Firestore server timestamp
      });

      // Clear inputs
      setName('');
      setProfessor('');
      setBuilding('');
      setRoomNumber('');
      setImageUrl('');
      setNote('');
      setStartTime('');
      setError('');
      alert('✅ Class added successfully!');

      setTimeout(() => {
        router.replace('/class/list_classes_screen'); //  Prevents navigation history stacking
      }, 100);
    } catch (err) {
      console.error('❌ Error adding class:', err);
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
      {Platform.OS === 'ios' ? (
  <View style={styles.pickerIOS}>
    <Picker
      selectedValue={building}
      onValueChange={(itemValue) => setBuilding(itemValue)}
      style={styles.picker}
      itemStyle={styles.pickerItem}
    >
      <Picker.Item label="Select a building" value="" />
      {buildingOptions.map((option) => (
        <Picker.Item key={option} label={option} value={option} />
      ))}
    </Picker>
  </View>
) : (
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={building}
      onValueChange={(itemValue) => setBuilding(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="Select a building" value="" />
      {buildingOptions.map((option) => (
        <Picker.Item key={option} label={option} value={option} />
      ))}
    </Picker>
  </View>
)}
      <Text style={styles.label}>Room Number (Optional)</Text>
      <TextInput style={styles.input} value={roomNumber} onChangeText={setRoomNumber} />

      {/*  Cross-platform Time Picker */}
      <Text style={styles.label}>Start Time * </Text>

      {Platform.OS === 'web' ? (
        //  Web: Use native HTML time input
        <TextInput
          style={styles.input}
          value={startTime}
          onChangeText={(text) => setStartTime(text)}
          placeholder="Select Time *(e.g. 5:00, 5:30)"
        />
      ) : (
        //  Mobile: Use native picker
        <TouchableOpacity style={styles.timePicker} onPress={() => setTimePickerVisible(true)}>
          <Text style={startTime ? styles.selectedTime : styles.placeholderText}>
            {startTime || 'Select Time'}
          </Text>
        </TouchableOpacity>
      )}

      {Platform.OS !== 'web' && isTimePickerVisible && (
       <View style={styles.pickerContainer}> 
       <DateTimePicker
          value={selectedDate || new Date()}
          mode="time"
          is24Hour={false}
          display="spinner"
          textColor="black"
          onChange={handleConfirmTime}
        />
        </View>
      )}

      <Text style={styles.label}>Image URL (Optional)</Text>
      <TextInput
      style={styles.input}
      value={imageUrl}
      onChangeText={(text) => setImageUrl(text)}
      placeholder="Paste image URL or upload below"/>
    <ImagePickerInput
      label="Upload Image"
      imageUrl={imageUrl}
      onChange={(uri) => setImageUrl(uri)}/>

      <Text style={styles.label}>Note (Optional)</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Add Class" onPress={handleAddClass} color="#28a745" />
    </ScrollView>
  );
};

export default AddClassScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16, 
    backgroundColor: '#fff' 
  },
  label: { 
    fontWeight: 'bold', 
    marginTop: 12 
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    overflow: 'hidden',
  },
  pickerIOS: {
    height: 150,
    justifyContent: 'center',
  },
  picker: {
    height: 48,
    width: '100%',
    color: '#333',
    backgroundColor: '#fff',
  },
  pickerItem: {
    fontSize: 16,
    height: 44,
  },
  pickerContainer: {
    backgroundColor: '#fff', 
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 4, 
    padding: 10, 
    marginTop: 4 
  },
  timePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  selectedTime: {
    color: '#000',
    fontWeight: 'bold',
  },
  placeholderText: {
    color: '#888',
  },
  error: { 
    color: 'red', 
    marginVertical: 8 
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
