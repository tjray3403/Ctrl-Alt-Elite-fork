import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import IndexScreen from "./index";
import RecommendationScreen from "./recommendations";
import ProfileScreen from "./profile";
import MapScreen from "./map";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Recommendations") {
            iconName = "compass";
          } else if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName as 'filter' | 'infinite' | 'text' | 'key' | undefined} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFD700", // Gold for active tab
        tabBarInactiveTintColor: "#A67C00", // Dark Gold for inactive
        tabBarStyle: {
          backgroundColor: "#6A0DAD", // Purple background
          borderTopColor: "#FFD700", // Gold border at the top
        },
        headerStyle: {
          backgroundColor: "#6A0DAD", // Purple header
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Home" component={IndexScreen} />
      <Tab.Screen name="Recommendations" component={RecommendationScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
  