import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown:false
    }}>
        
        <Tabs.Screen name='map'
            options={{
                tabBarIcon:({color,size})=>(
                    <FontAwesome5 name="map-marker-alt" size={24} color="black" />
                )
            }}/>
        <Tabs.Screen name='index' 
            options={{
                tabBarIcon:({color,size})=>(
                    <FontAwesome name="home" size={24} color="black" />
                )
            }}/>
        <Tabs.Screen name='profile'
            options={{
                tabBarIcon:({color,size})=>(
                    <FontAwesome name="user" size={24} color="black" />
                )
            }}/>
        <Tabs.Screen name='Recommendations'
            options={{
                tabBarIcon:({color,size})=>(
                    <FontAwesome name="smile-o" size={24} color="black" />
                )
            }}/>
        <Tabs.Screen name='weather'
            options={{
                tabBarIcon:({color,size})=>(
                    <FontAwesome name="smile-o" size={24} color="black" />
                )
            }}/>
    </Tabs>
  )
}