// ClassesStack.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ListClassesScreen from './list_classes_screen'
import ClassDetailScreen from './class_detail_screen'
import AddClassScreen from './add_class_screen'

const Stack = createNativeStackNavigator()

const ClassesStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ListClasses">
      <Stack.Screen 
        name="ListClasses" 
        component={ListClassesScreen} 
        options={{ title: 'My Classes' }} 
      />
      <Stack.Screen 
        name="ClassDetail" 
        component={ClassDetailScreen} 
        options={{ title: 'Class Detail' }} 
      />
      <Stack.Screen 
        name="AddClass" 
        component={AddClassScreen} 
        options={{ title: 'Add New Class' }} 
      />
    </Stack.Navigator>
  )
}

export default ClassesStack
