import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Stack } from "expo-router";
import IndexScreen from './index';
import ExploreScreen from './explore';
import ProfileScreen from './profile';
import MapScreen from './map';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={IndexScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
