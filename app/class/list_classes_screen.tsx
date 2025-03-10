import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Button } from 'react-native';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface ClassItem {
  id: string;
  name: string;
  imageUrl?: string;
  professor?: string;
  building?: string;
  roomNumber?: string;
}

const ListClassesScreen: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [classes, setClasses] = useState<ClassItem[]>([]);
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
  
      const fetchClasses = async () => {
        try {
          const userClassesRef = collection(db, `users/${user.uid}/classes`);
          const snapshot = await getDocs(userClassesRef);
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ClassItem[];
          setClasses(data);
        } catch (err) {
          console.error('Error fetching classes:', err);
        }
      };
  
      fetchClasses();
    }, [user]) // This makes sure it updates when the user changes
  );
  const renderClassCard = ({ item }: { item: ClassItem }) => {
    return (
      <Link href={`/class/class_detail_screen?classId=${item.id}`} asChild>
        <TouchableOpacity style={styles.card}>
          <Image
            //source={item.imageUrl ? { uri: item.imageUrl } : require('@/assets/placeholder.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.className}>{item.name}</Text>
            {item.professor && <Text style={styles.classSubInfo}>{item.professor}</Text>}
            <Text style={styles.classSubInfo}>{item.building}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Link href="/">
          My Classes </Link> </Text>

        <View style={styles.buttonContainer}>
          <Link href="/class/add_class_screen" asChild>
            <Button title="Add Class" />
          </Link>
          <Link href="/class/edit_class_screen" asChild>
            <Button title="Edit Classes" />
          </Link>
        </View>
      </View>

      {/* List of Classes */}
      <FlatList
        data={classes}
        renderItem={renderClassCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ListClassesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classSubInfo: {
    fontSize: 14,
    color: '#888',
  },
});
