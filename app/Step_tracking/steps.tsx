import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { StatusBar } from 'react-native'; // Importing StatusBar from react-native
import Value from '@/components/Value'; // Importing the Value component to display step tracking information
import RingProgress from '@/components/RingProgress';  

/**
 * A functional React component that displays step tracking information.
 * 
 * This component renders a view containing details about the user's steps, 
 * distance traveled, and flights climbed. The layout is organized using 
 * nested `View` components with `flexDirection` styling for proper alignment.
 * 
 * @returns {JSX.Element} A JSX element displaying step tracking data.
 */


const steps = () => {
  return (
    <View style={styles.container}>
        <RingProgress /> {/* This will display the ring progress */}

        <View style={styles.values}> {/* This will allow the titles to be horizontal and the info displayed below it */}
            <Value label = "Steps:" value="1219" />
            <Value label = "Distance:" value=".75 miles" />
            <Value label = "Flights Climbed:" value="3" />
            
        </View>

        <StatusBar barStyle="dark-content" /> {/* This will change the status bar to dark mode */}
    
    </View>
  )
}

export default steps

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
    values: {
        flexDirection: 'row', // Change to column to stack items vertically
        gap: 3,
        flexWrap: 'wrap', // Allow items to wrap to the next line if needed'
        rowGap: 20, // Add gap between rows
        columnGap:1, // Add gap between columns
    },

    
});


