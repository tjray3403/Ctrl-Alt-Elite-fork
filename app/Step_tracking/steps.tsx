import { View, Text, StyleSheet } from 'react-native'
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
    <View  style={styles.valueContainer}> {/* hi*/}
    <Text style={styles.label}>{label} </Text>
    <Text style={styles.value}>{value}</Text>
    </View>


);

const steps = () => {
  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row'}}> {/* This will allow the titles to be horizontal and the info displayed below it */}
            <Value label = "Steps:" value="1219" />
            <Value label = "Distance:" value=".75 miles" />
            
        </View>
        {/* */}

            <View style={styles.valueContainer}> 
                <Text style={styles.label}>Flights Climbed: </Text>
                <Text style={styles.value}>3</Text>
            </View>
       
    
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
    label: { 
        fontWeight: '700', //Changing thickness of the font
        fontSize: 35,


    },
    value: {
        fontSize: 35,
        color: '#333',


    },
    valueContainer: { 
        marginRight: 50 // This allows me to space the steps, distance and flights climbed so they're not right on top of each other
    },


    })