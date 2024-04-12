import React, { useState } from "react";
//import { useNavigation } from '@react-navigation/native'; 
//import { createStackNavigator } from '@react-navigation/native-stack';
import { View, SafeAreaView, Text, StyleSheet, Dimensions } from 'react-native';
import { Drawer, List, Avatar, Title, Caption  } from 'react-native-paper';
import Logo from "../components/Logo";
import Schedule from "./mainPageContent/Schedule";
import Inventory from "./mainPageContent/Inventory";
import Staff from "./mainPageContent/Staff";
import Rooms from "./mainPageContent/Rooms";
import Inbox from "./mainPageContent/Inbox";
import { theme } from "../core/theme";
/*import AddItem from "./AddItem";
import Request from "./RequestAppointment"
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
  Staff: Staff,
  Rooms: Rooms,
  Inbox: Inbox,
  // Add other components here as needed
};

const windowWidth = Dimensions.get('window').width;

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
                    <Text style={styles.logo}>MediFlow 🏥</Text>
                    <List.Item title="Schedule" onPress={handleContentChange("Schedule")} />
                    <List.Item title="Inventory" onPress={handleContentChange("Inventory")} />
                    <List.Item title="Staff" onPress={handleContentChange("Staff")} />
                    <List.Item title="Rooms" onPress={handleContentChange("Rooms")} />
                    <List.Item title="Inbox" onPress={handleContentChange("Inbox")} />
                    {/* ... Other List Items */}
                </Drawer.Section>

                <View style={{ flex: 1, backgroundColor: 'white', width: '100%' }}>
                    {ActiveComponent && <ActiveComponent />}
                </View>

                <View style={styles.sidebar}>
                    <Avatar.Image style={styles.avatar} source={require('../assets/profilePic.jpeg')} />
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
    width: '18%',
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    verticalAlign: 'middle',
    paddingTop: '10%',
  },
  center: {
    flex: 1,
    backgroundColor: 'white',
  },
  avatar: {
    width: windowWidth * 0.1,
    aspectRatio: 1,
  },
  logo: {
    fontSize: 36,
    color: 'black',
    fontWeight: 'bold',
    paddingVertical: 12,
  }
});