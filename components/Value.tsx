import { View, Text, StyleSheet } from 'react-native';
import React from 'react';



{/*This is needed in typescript since it requires types so it needs to know what it should be taking in */}
type ValueProps = {
    label: string;
    value: string;
}

{/**
 * A functional component that displays a label and its corresponding value.*/}
const Value = ({label, value}: ValueProps) => (
    <View style={styles.valueContainer}> {/* hi*/}
    <Text style={styles.label}>{label} </Text> {/* Displays the label (e.g., "Steps:") */ }
    <Text style={styles.value}>{value}</Text> {/* Displays the value (e.g., "1219") */}
    </View>


);


const styles = StyleSheet.create({
   
    label: { 
        fontWeight: '700', // Changing thickness of the font
        fontSize: 40,
    },
    value: {
        fontSize: 45,
        color: '#333',
    },
    valueContainer: {
        marginVertical: 10, // Add vertical margin between items
        minWidth: '30%', // Ensure each item takes up at least half the width


    },
}
);

export default Value;
