// ✅ edit_class_screen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { db } from '@/config/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {LocationName} from '../../config/building_names'
import { Picker } from '@react-native-picker/picker';
import ImagePickerInput from '@/components/imagePickerInput';
import DropDownList from '@/components/DropdownList';

interface ClassData {
  name: string;
  professor?: string;
  building: string;
  roomNumber?: string;
  imageUrl?: string;
  note?: string;
  startTime: string;
}

const EditClassScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const { classId } = useLocalSearchParams();
  const router = useRouter();

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedbuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const buildingOptions = Object.values(LocationName);


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
            router.replace('/class/list_classes_screen');
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

  const handleConfirmTime = (event: any, selectedTime?: Date) => {
    if (selectedTime && classData) {
      setSelectedDate(selectedTime);
      setClassData({ ...classData, startTime: moment(selectedTime).format('hh:mm A') });
    }
    setTimePickerVisible(false);
  };

  const handleUpdateClass = async () => {
    if (!user || !classId || !classData) return;

    try {
      const docRef = doc(db, `users/${user.uid}/classes/${classId}`);
      await updateDoc(docRef, { ...classData });

      Alert.alert('Success', 'Class updated successfully');
      setTimeout(() => {
        router.replace('/class/list_classes_screen');
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
              router.replace('/class/list_classes_screen');
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
        <TouchableOpacity onPress={() => router.replace('/profile')}>
          <Text style={styles.backButton}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading class data...</Text>
        </View>
      </View>
    );
  }

  if (!classData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Class not found.</Text>
      </View>
    );
  }
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={styles.backButton}>← Home</Text>
      </TouchableOpacity>

      <ScrollView>
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
      <View style={{ flex: 1, padding: 16 , zIndex:3}}>
      <Text style={{ marginBottom: 8 }}>Choose a building:</Text>

      <View style={{zIndex:4}}>
      <DropDownList
      
          enumList={buildingOptions}
          onSelect={(value) => {
            setSelectedBuilding(value);
            setClassData({ ...classData, building: value });
          } }
          placeholder="Select a building" selectedValue={''}
                    />
          
</View>
      <Text style={styles.selectedValue}>
        Selected Building: {selectedbuilding}
      </Text>
    </View>


        <Text style={styles.label}>Room Number (Optional)</Text>
        <TextInput
          style={styles.input}
          value={classData.roomNumber || ''}
          onChangeText={(text) => setClassData({ ...classData, roomNumber: text })}
        />

      {/*  Start Time */}
      <Text style={styles.label}>Start Time * </Text>
      {Platform.OS === 'web' ? (
        //  Web: Use native HTML time input
        <TextInput
          style={styles.input}
          value={classData.startTime}
          onChangeText={(text) => setClassData({ ...classData, startTime: text })}
          placeholder="Select Time *(e.g. 5:00 AM, 5:30 PM)"
        />
      ) : (
        //  Mobile: Use native picker
        <TouchableOpacity style={styles.input} onPress={() => setTimePickerVisible(true)}>
          <Text>{classData.startTime || 'Select Time'}</Text>
        </TouchableOpacity>
      )}

        {Platform.OS !== 'web' && isTimePickerVisible && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={handleConfirmTime}
            />
          </View>
        )}

      <Text style={styles.label}>Image URL (Optional)</Text>
      <Text style={styles.label}>Image (Optional)</Text>
<TextInput
  style={styles.input}
  value={classData.imageUrl || ''}
  onChangeText={(text) => setClassData({ ...classData, imageUrl: text })}
  placeholder="Paste image URL or upload below"
/>
<ImagePickerInput
  label="Upload Image"
  imageUrl={classData.imageUrl || ''}
  onChange={(uri) => setClassData({ ...classData, imageUrl: uri })}
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
    </View>
  );
};

export default EditClassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedValue: {
    marginTop: 16,
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
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
  backButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
