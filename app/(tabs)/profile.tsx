import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

export default function Profile() {
  // Floating Animation Effect
  const glowOpacity = useSharedValue(0.5);
  useEffect(() => {
    glowOpacity.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.ease }),
      -1, // Infinite loop
      true // Reverse animation
    );
  }, []);

  const glowingStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* Glowing Animated Profile Image */}
        <Animated.View style={[styles.imageContainer, glowingStyle]}>
          <Image 
            source={require('../../assets/images/kopp.jpeg')} 
            style={styles.profileImage}
          />
        </Animated.View>
        
        {/* Name */}
        <Text style={styles.name}>John Doe</Text>

        {/* Age and Weight */}
        <Text style={styles.info}>Age: 28</Text>
        <Text style={styles.info}>Weight: 180 lbs</Text>

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
    backgroundColor: '#0a0a0a', // Dark futuristic background
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#ff0000', // Red glow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
    width: '90%',
    borderWidth: 2,
    borderColor: '#ff0000', // Red border
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff000033', // Subtle red glow effect
    padding: 8,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#ff0000', // Red border for profile pic
  },
  name: {
    fontSize: 32, // Larger futuristic font
    fontWeight: 'bold',
    color: '#ff0000', // Red neon name
    marginTop: 10,
    textShadowColor: '#ff2222',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  info: {
    fontSize: 20,
    color: '#ff6666', // Slightly lighter red for text
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  activityButton: {
    backgroundColor: '#990000', // Darker red for secondary button
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  activityText: {
    color: '#fff',
  },
});
