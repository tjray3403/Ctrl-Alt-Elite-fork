import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
        <Tabs.Screen name='index' />
        <Tabs.Screen name='map'/>
        <Tabs.Screen name='profile'/>
        <Tabs.Screen name='recommendations'/>
    </Tabs>
  )
}