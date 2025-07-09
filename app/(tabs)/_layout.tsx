import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name='index' options={{ title: 'Receive', headerShown: false }} />
            <Tabs.Screen name='requests' options={{ title: 'Requests', headerShown: false }} />
            <Tabs.Screen name='inventory' options={{ title: 'Inventory', headerShown: false }} />
            <Tabs.Screen name='profile' options={{ title: 'Profile', headerShown: false }} />
        </Tabs>
    );
}
