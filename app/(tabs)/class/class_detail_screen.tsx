// ClassDetailScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { db } from '@/config/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface ClassData {
  name: string
  imageUrl?: string
  professor?: string
  building?: string
  roomNumber?: string
  assignments?: string[]
  note?: string
  location?: {
    latitude: number
    longitude: number
  }
}

const ClassDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { classId } = route.params
  const [classData, setClassData] = useState<ClassData | null>(null)

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const docRef = doc(db, 'classes', classId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setClassData(docSnap.data() as ClassData)
        }
      } catch (err) {
        console.error('Error fetching class:', err)
      }
    }
    fetchClass()
  }, [classId])

  if (!classData) {
    return (
      <View style={styles.container}>
        <Text>Loading class details...</Text>
      </View>
    )
  }

  const {
    name,
    imageUrl,
    professor,
    building,
    roomNumber,
    assignments,
    note,
    location
  } = classData

  return (
    <ScrollView style={styles.container}>
      {/* Top image / banner */}
      <Image
        source={imageUrl ? { uri: imageUrl } : require('./assets/placeholder.png')}
        style={styles.bannerImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.classTitle}>{name}</Text>
        {professor && <Text style={styles.classInfo}>Professor: {professor}</Text>}
        {building && <Text style={styles.classInfo}>Building: {building}</Text>}
        {roomNumber && <Text style={styles.classInfo}>Room: {roomNumber}</Text>}

        {/* Assignments */}
        {assignments && assignments.length > 0 && (
          <View style={styles.assignmentsContainer}>
            <Text style={styles.subtitle}>Assignments:</Text>
            {assignments.map((a, idx) => (
              <Text key={idx} style={styles.bulletItem}>• {a}</Text>
            ))}
          </View>
        )}

        {/* Notes */}
        {note && (
          <View style={styles.noteContainer}>
            <Text style={styles.subtitle}>Note:</Text>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        )}

        {/* If you use a Map View, you could render it here with coordinates */}
        {location?.latitude && location?.longitude && (
          <View style={styles.mapPlaceholder}>
            <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
              Map placeholder at lat: {location.latitude}, long: {location.longitude}
            </Text>
            {/* 
              For a real map, integrate react-native-maps or a WebView with Google Maps.
              <MapView
                style={{ width: '100%', height: 200 }}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                }}
              >
                <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
              </MapView>
            */}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ClassDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  detailsContainer: {
    padding: 16
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  classInfo: {
    fontSize: 16,
    marginBottom: 4
  },
  assignmentsContainer: {
    marginTop: 12
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  bulletItem: {
    fontSize: 14,
    marginLeft: 8
  },
  noteContainer: {
    marginTop: 12
  },
  noteText: {
    fontSize: 14,
    marginTop: 4
  },
  mapPlaceholder: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  }
})
