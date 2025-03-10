// ListClassesScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import { db } from '@/config/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'

interface ClassItem {
  id: string
  name: string
  imageUrl?: string
  professor?: string
  building?: string
  roomNumber?: string
}

const ListClassesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [classes, setClasses] = useState<ClassItem[]>([])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'classes'))
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClassItem[]
        setClasses(data)
      } catch (err) {
        console.error('Error fetching classes:', err)
      }
    }
    fetchClasses()
  }, [])

  const renderClassCard = ({ item }: { item: ClassItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ClassDetail', { classId: item.id })}
      >
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : require('./assets/placeholder.png')}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.classSubInfo}>{item.professor}</Text>
          <Text style={styles.classSubInfo}>{item.building}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={renderClassCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export default ListClassesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa'
  },
  listContent: {
    padding: 16
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2
  },
  cardImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover'
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center'
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  classSubInfo: {
    fontSize: 14,
    color: '#888'
  }
})
