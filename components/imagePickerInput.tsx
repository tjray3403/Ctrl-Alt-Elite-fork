import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  label?: string;
  imageUrl: string;
  onChange: (uri: string) => void;
}

const ImagePickerInput: React.FC<Props> = ({ label = 'Image', imageUrl, onChange }) => {
  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      onChange(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} (Optional)</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handlePick}>
        <Text style={styles.uploadButtonText}>
          {imageUrl ? 'Change Image' : 'Upload Image'}
        </Text>
      </TouchableOpacity>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.imagePreview} resizeMode="cover" />
      ) : null}
    </View>
  );
};

export default ImagePickerInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
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
