import React from 'react';
import { Text, View } from 'react-native';
import MapView from 'react-native-maps';
export default function App() {
    return (
        <View style={styles.container}>
    <Text> React Native Maps </Text>
    <MapView
    style={styles.map}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>


    </MapView>
    </View>
);
}

const styles=StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
        justifyContent:'center',
        alignItems:'center'
    },
    map:{
        ...StyleSheet.absoluteFillObject,
    }   
})