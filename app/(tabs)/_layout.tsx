import { Tabs } from 'expo-router';
import { AntDesign, Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#539DF3',
            tabBarStyle: {
                backgroundColor: '#1C1C1C',
                borderColor: '#1C1C1C'
            }
        }}>
            <Tabs.Screen name='index' options={{
                title: 'Receive',
                headerShown: false,
                tabBarInactiveTintColor: '#8D949D',
                tabBarIcon: ({ color }) => <AntDesign name="pluscircleo" size={24} color={color} />
            }} />
            <Tabs.Screen name='requests' options={{
                title: 'Requests',
                headerShown: false,
                tabBarInactiveTintColor: '#8D949D',
                tabBarIcon: ({ color }) => <FontAwesome6 name="magnifying-glass" size={24} color={color} />
            }} />
            <Tabs.Screen name='inventory' options={{
                title: 'Inventory',
                headerShown: false,
                tabBarInactiveTintColor: '#8D949D',
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="message-alert-outline" size={26} color={color} />
            }} />
            <Tabs.Screen name='profile' options={{
                title: 'Profile',
                headerShown: false,
                tabBarInactiveTintColor: '#8D949D',
                tabBarIcon: ({ color }) => <Feather name="user" size={26} color={color} />
            }} />
        </Tabs>
    );
}
