import React, { useRef, useEffect, useState } from 'react';
//import MapView, { PROVIDER_DEFAULT, Marker, Callout, Polyline } from 'react-native-maps';
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
  return <Text>Map functionality is not available on the web.</Text>;
  }