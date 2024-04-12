import React, { useState } from "react";
//import { useNavigation } from '@react-navigation/native'; 
//import { createStackNavigator } from '@react-navigation/native-stack';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import { Drawer, List, Avatar, Title, Caption  } from 'react-native-paper';
import Logo from "../components/Logo";
import Schedule from "./Schedule";
import Inventory from "./Inventory";
/*import AddItem from "./AddItem";
import Request from "./RequestAppointment"
import Rooms from "./Rooms";
import Staff from "./Staff";
import Inbox from "./Inbox";
import ChatScreen from './ChatScreen';
import AddStaff from "./AddStaff";
import AddInventory from "./AddInventory";
import AddRoom from "./AddRoom";
import CreateProcess from "./CreateProcess";*/

//const ContentStack = createStackNavigator(); 

// Mock array of upcoming patients
const upcomingPatients = [
  // ... your data 
];

// Define a mapping from route names to components
const COMPONENT_MAP = {
  Schedule: Schedule,
  Inventory: Inventory,
  // Add other components here as needed
};

export default function MainPage() {
    const [activeComponent, setActiveComponent] = useState('Schedule');
    //const navigation = useNavigation();

    const handleContentChange = (routeName) => () => {
        //navigation.navigate(routeName);
        setActiveComponent(routeName); 
    };

    // Dynamically select the component based on the activeComponent state
    const ActiveComponent = COMPONENT_MAP[activeComponent];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Drawer.Section style={styles.sidebar}>
                    <Logo style={{fontSize: 30}}/>
                    <List.Item title="Schedule" onPress={handleContentChange("Schedule")} />
                    <List.Item title="Inventory" onPress={handleContentChange("Inventory")} />
                    {/* ... Other List Items */}
                </Drawer.Section>

                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    {/* Render the active component */}
                    {ActiveComponent && <ActiveComponent />}
                </View>

                <View style={styles.sidebar}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '20%',
    backgroundColor: 'lightgray',
  },
  center: {
    flex: 1,
    backgroundColor: 'white',
  },
});