/*import React, { useRef, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
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
            <View style={{ padding: 10 }}>
              <Text>Next Class</Text>
            </View>
          </TouchableOpacity>
        ),
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

  if (Platform.OS === "web") {
    // Web Fallback UI
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webText}>MapView is not supported on the web.</Text>
      </View>
    );
  }

  if (!MapView || !Marker || !PROVIDER_GOOGLE) {
    // Return loading screen until dynamic imports are loaded
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
        {markers.map((marker: MapMarker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
          />
        ))}
      </MapView>
    </View>
  );
}
*/

