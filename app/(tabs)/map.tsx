import React, { useRef, useEffect, useState } from 'react';
import MapView, { PROVIDER_DEFAULT, Marker, Callout, Polyline } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { markers } from '../../assets/markers';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getAuth } from 'firebase/auth';
import * as Location from 'expo-location';
import moment from 'moment';
import { MAPBOX_CONFIG } from '@/config/mapbox';

interface MapMarker {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  pinColor: string;
}

interface ClassItem {
  id: string;
  name: string;
  building?: string;
  startTime: string;
  date?: string;
}

type TransportMode = 'walking' | 'cycling' | 'driving';

const INITIAL_REGION = {
  latitude: 30.0933,
  longitude: -95.9877,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
};

const styles = StyleSheet.create({
  callout: {
    width: 200,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
  },
  headerRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    margin: 10,
  },
  routeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  routeText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modeSelector: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 5,
  },
  modeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  modeButtonActive: {
    backgroundColor: '#4B0082',
  },
  modeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
});

export default function MapScreen() {
  const mapRef = useRef<any>();
  const navigation = useNavigation();
  const [nextClass, setNextClass] = useState<ClassItem | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number, longitude: number}[]>([]);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [transportMode, setTransportMode] = useState<TransportMode>('walking');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    // Get user's location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();

    // Get next class only if user is authenticated
    const getNextClass = async () => {
      if (!user) {
        setNextClass(null);
        return;
      }

      setIsLoadingClasses(true);
      try {
        const userClassesRef = collection(db, `users/${user.uid}/classes`);
        const snapshot = await getDocs(userClassesRef);
        const classes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClassItem[];

        const todayDate = moment().format('YYYY-MM-DD');
        const currentTime = moment().format('hh:mm A');

        // Filter classes for today or those without a specific date
        const todaysClasses = classes.filter(classItem => {
          return !classItem.date || classItem.date === todayDate;
        });

        // Sort classes by start time
        const sortedClasses = todaysClasses.sort((a, b) => {
          const timeA = moment(a.startTime, "hh:mm A");
          const timeB = moment(b.startTime, "hh:mm A");
          return timeA.diff(timeB);
        });

        // Find the next class
        const next = sortedClasses.find(c => moment(c.startTime, "hh:mm A").isAfter(moment(currentTime, "hh:mm A")));
        setNextClass(next || null);
      } catch (err) {
        console.error('Error fetching next class:', err);
        setNextClass(null);
      } finally {
        setIsLoadingClasses(false);
      }
    };

    getNextClass();
  }, [user]);

  const calculateRoute = async () => {
    if (!userLocation || !nextClass || !nextClass.building) return;

    const buildingMarker = markers.find(m => m.name === nextClass.building);
    if (!buildingMarker) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${userLocation.coords.longitude},${userLocation.coords.latitude};${buildingMarker.longitude},${buildingMarker.latitude}?geometries=geojson&access_token=${MAPBOX_CONFIG.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: number[]) => ({
          latitude: coord[1],
          longitude: coord[0]
        }));
        
        setRouteCoordinates(coordinates);
        
        // Calculate distance and duration
        const distance = (route.distance / 1609.34).toFixed(1); // Convert meters to miles
        const duration = Math.ceil(route.duration / 60); // Convert seconds to minutes
        
        setRouteInfo({
          distance: `${distance} miles`,
          duration: `${duration} minutes`
        });

        // Animate to show the route
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const focusMap = () => {
    if (!nextClass || !userLocation || !nextClass.building) return;

    const buildingMarker = markers.find(m => m.name === nextClass.building);
    if (!buildingMarker) return;

    mapRef.current?.animateToRegion({
      latitude: buildingMarker.latitude,
      longitude: buildingMarker.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001
    });
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
            pinColor={marker.pinColor}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.title}>{marker.name}</Text>
                <Text style={styles.description}>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4B0082" // PVAMU Purple
            strokeWidth={3}
          />
        )}
      </MapView>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={focusMap}>
          <View style={{padding: 10}}>
            <Text>
              {isLoadingClasses 
                ? 'Loading classes...' 
                : !user 
                  ? 'Sign in to see classes' 
                  : nextClass 
                    ? `Next: ${nextClass.name}` 
                    : 'No upcoming classes'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {nextClass && (
        <>
          <View style={styles.modeSelector}>
            <TouchableOpacity 
              style={[styles.modeButton, transportMode === 'walking' && styles.modeButtonActive]}
              onPress={() => setTransportMode('walking')}
            >
              <Text style={[styles.modeButtonText, transportMode === 'walking' && styles.modeButtonTextActive]}>
                Walking
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, transportMode === 'cycling' && styles.modeButtonActive]}
              onPress={() => setTransportMode('cycling')}
            >
              <Text style={[styles.modeButtonText, transportMode === 'cycling' && styles.modeButtonTextActive]}>
                Cycling
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, transportMode === 'driving' && styles.modeButtonActive]}
              onPress={() => setTransportMode('driving')}
            >
              <Text style={[styles.modeButtonText, transportMode === 'driving' && styles.modeButtonTextActive]}>
                Driving
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.routeButton} onPress={calculateRoute}>
            <Text style={styles.routeText}>Show Route</Text>
          </TouchableOpacity>
        </>
      )}
      {routeInfo && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>
            Distance: {routeInfo.distance} • Time: {routeInfo.duration}
          </Text>
        </View>
      )}
    </View>
  );
}