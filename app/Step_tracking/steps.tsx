import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'

/**
 * A functional React component that displays step tracking information.
 * 
 * This component renders a view containing details about the user's steps, 
 * distance traveled, and flights climbed. The layout is organized using 
 * nested `View` components with `flexDirection` styling for proper alignment.
 * 
 * @returns {JSX.Element} A JSX element displaying step tracking data.
 */


{/*This is needed in typescript since it requires types so it needs to know what it should be taking in */}
type ValueProps = {
    label: string;
    value: string;
}

{/**
 * A functional component that displays a label and its corresponding value.*/}
const Value = ({label, value}: ValueProps) => (
    <View style={styles.valueContainer}> {/* hi*/}
    <Text style={styles.label}>{label} </Text>
    <Text style={styles.value}>{value}</Text>
    </View>


);

const steps = () => {
  return (
    <View style={styles.container}>
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
        gap: 25,
        flexWrap: 'wrap', // Allow items to wrap to the next line if needed'
        rowGap: 20, // Add gap between rows
        columnGap: 1, // Add gap between columns
    },
    label: { 
        fontWeight: '700', // Changing thickness of the font
        fontSize: 35,
    },
    value: {
        fontSize: 45,
        color: '#333',
    },
    valueContainer: {
        marginVertical: 10, // Add vertical margin between items
        minWidth: '30%', // Ensure each item takes up at least half the width


    },
    
});
