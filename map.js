/*import React from 'react';
import { Text, View } from 'react-native';
import MapView from 'react-native-maps';
export default function App() {
  if (Platform.OS !== "web") {
    // Native platforms (iOS/Android) with dynamic import
    const MapView = require("react-native-maps").default;
    
    return (
      <View style={styles.container}>
        <Text>React Native Maps</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    );
  } else {
    // Web platforms
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webText}>MapView is not supported on the web.</Text>
      </View>
    );
  }
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