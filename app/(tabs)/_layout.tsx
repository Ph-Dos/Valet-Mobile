import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

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
                tabBarIcon: ({ color }) => {
                    return <MaterialIcons name="add-circle-outline" size={26} color={color} />;
                }
            }} />
            <Tabs.Screen name='requests' options={{
                title: 'Requests',
                headerShown: false,
                tabBarInactiveTintColor: '#8D949D',
                tabBarIcon: ({ color }) => {
                    return <MaterialIcons name="directions-car" size={26} color={color} />
                },
                tabBarBadge: 2,
                tabBarBadgeStyle: {
                    backgroundColor: 'tomato',
                    color: 'white'
                }
            }} />
            <Tabs.Screen name='inventory' options={{
                title: 'Inventory',
                headerShown: false,
                tabBarInactiveTintColor: '#8D949D',
                tabBarIcon: ({ color }) => {
                    return <MaterialIcons name="search" size={26} color={color} />;
                }
            }} />
            <Tabs.Screen name='profile' options={{
                title: 'Profile',
                headerShown: false,
                tabBarInactiveTintColor: '#8D949D',
                tabBarIcon: ({ color }) => {
                    return <MaterialIcons name="person-outline" size={26} color={color} />;
                }
            }} />
        </Tabs>
    );
}
