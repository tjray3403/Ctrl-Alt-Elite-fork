import React, { useRef, useEffect } from 'react';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from 'expo-router';



const INITIAL_REGION = {
latitude: 30.0933,
longitude: -95.9877,
latitudeDelta: 0.005,
longitudeDelta: 0.005
};


export default function App() {
  const mapRef = useRef<any>();
  const navigation = useNavigation();

useEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={focusMap}>
        <View style={{padding: 10}}>
        <Text>Next Class</Text>
        </View>
      </TouchableOpacity>
    )
  });
}, []);

const focusMap = () => {
  const SRCollins = {
    latitude: 30.0933,
  longitude: -95.9877,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
  };

  mapRef.current?.animateToRegion(SRCollins);
  
}

  return (
    <View style={{flex: 1}}>
      <MapView style={StyleSheet.absoluteFill} provider={PROVIDER_DEFAULT}
      initialRegion={INITIAL_REGION}
      showsUserLocation
      showsMyLocationButton
      ref={mapRef}
      />
    </View>
  );
}