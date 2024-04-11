import React from "react";
import { useNavigation } from '@react-navigation/native'; 
import { View, SafeAreaView, Text } from 'react-native'; // Replace Box
import { Drawer, List, Avatar, Title, Caption  } from 'react-native-paper';
/*import Schedule from "./Schedule";
import Inventory from "./Inventory";
import AddItem from "./AddItem";
import Request from "./RequestAppointment"
import Rooms from "./Rooms";
import Staff from "./Staff";
import Inbox from "./Inbox";
import ChatScreen from './ChatScreen';
import AddStaff from "./AddStaff";
import AddInventory from "./AddInventory";
import AddRoom from "./AddRoom";
import CreateProcess from "./CreateProcess";*/

// Mock array of upcoming patients
const upcomingPatients = [
  // ... your data 
];

export default function MainPage() {
    const drawerWidth = 200; 
    const navigation = useNavigation();

    const handleNavigation = (routeName) => () => {
        navigation.navigate(routeName);
    };

    const handleRefreshClick = (targetPath) => (event) => {
        if (navigation.getCurrentRoute().name === targetPath) {
        event.preventDefault(); 
        navigation.reset({
            index: 0,
            routes: [{ name: targetPath }],
        });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Drawer.Section>
                    <List.Item title="Schedule" onPress={handleNavigation("Schedule")} />
                    <List.Item title="Inventory" onPress={handleRefreshClick("Inventory")} />
                    {/* ... Other List Items */}
                </Drawer.Section>

                <View style={{ flex: 1, backgroundColor: 'white' }}> 
                    {/* Main Content Area - Adjust background as needed */}
                </View>

                <View style={{ /* ... Profile Bar Styles */ }}>
                    <Avatar.Image size={50} source={require('../assets/profilePic.jpeg')} />
                    <Text>Dr. Jane Doe</Text>
                    <Text>Upcoming Patients</Text>
                    {upcomingPatients.map((patient, index) => (
                    <View key={index} /* ...styles */>
                        {/* ...Patient info */}
                    </View>
                    ))}
                </View>
        </View>
        </SafeAreaView>
    );
};