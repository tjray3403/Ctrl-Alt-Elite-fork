import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* Profile Picture */}
        <Image 
          source={require('../../assets/images/kopp.jpeg')} 
          style={styles.profileImage}
        />
        
        {/* Name */}
        <Text style={styles.name}>Kel Onyewuenyi</Text>

        {/* Age and Weight */}
        <Text style={styles.info}>Age: 25</Text>
        <Text style={styles.info}>Weight: 175 lbs</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.activityButton]}>
            <Text style={[styles.buttonText, styles.activityText]}>My Activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '90%',
  },
  profileImage: {
    width: 150, // Increased size
    height: 150, // Increased size
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#4c669f',
  },
  name: {
    fontSize: 28, // Larger name
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  info: {
    fontSize: 20, // Larger age & weight
    color: '#555',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#4c669f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activityButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityText: {
    color: '#fff',
  },
});

