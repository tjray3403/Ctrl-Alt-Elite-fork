/*import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { markers } from '../../config/markers';

const INITIAL_REGION = {
  latitude: 30.0933,
  longitude: -95.9877,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
  latitude: 30.0933,
  longitude: -95.9877,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export default function App() {
  const [MapView, setMapView] = useState<any>(null); // State to hold the dynamic import of MapView
  const [Marker, setMarker] = useState<any>(null); // State to hold the dynamic import of Marker
  const [PROVIDER_GOOGLE, setProviderGoogle] = useState<any>(null); // State to hold PROVIDER_DEFAULT

  useEffect(() => {
    
      const {
        default: MapView,
        Marker,
        PROVIDER_GOOGLE,
      } = require("react-native-maps");
      setMapView(MapView);
      setMarker(Marker);
      setProviderGoogle(PROVIDER_GOOGLE);
    
  }, []);

  const navigation = useNavigation();
  const mapRef = useRef<any>();

  const windowWidth = Dimensions.get("window").width;
    useEffect(() => {
    if (Platform.OS !== "web") {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={focusMap}>
              <View style={{  padding: 10  }}>
                  <Text>Next Class</Text>
              </View>
            </TouchableOpacity>
          ),,
        });
    }
    }, [navigation]);

  const focusMap = () => {
    const SRCollins = {
      latitude: 30.0933,
      longitude: -95.9877,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    mapRef.current?.animateToRegion(SRCollins);
  };

  // ❗ Skip map if on web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text>🗺️ Map not supported on web</Text>
      </View>
    );
  }

  // ✅ Native-only import (safe on iOS/Android)
  const MapView = require('react-native-maps').default;
  const { Marker, PROVIDER_GOOGLE } = require('react-native-maps');

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        showsPointsOfInterest={false}
        ref={mapRef}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
*/