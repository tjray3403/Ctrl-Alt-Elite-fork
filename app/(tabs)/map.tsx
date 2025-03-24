import React, { useRef, useEffect } from 'react';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from 'expo-router';
import { markers } from '../../config/markers';

interface MapMarker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

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
      showsPointsOfInterest={false}
      ref={mapRef}
      >
        {markers.map((marker: MapMarker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            title={marker.name}
          />
        ))}
      </MapView>
    </View>
  );
}