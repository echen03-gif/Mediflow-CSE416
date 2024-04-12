import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; 

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null); // Add a state for the selected event
  const navigation = useNavigation();


  const events = [
    { title: 'Appointment 1', date: '2024-04-01T10:00:00' },
    { title: 'Appointment 2', date: '2024-04-02T14:00:00' },
    { title: 'Appointment 3', date: '2024-04-05T16:00:00' },
    // Add more appointments as needed
  ];

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    //let calendarApi = calendarRef.current.getApi();
    //calendarApi.changeView('timeGridDay', arg.date);
  };

  const handleRequest = () => {
    navigation.navigate('Request');
  }

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  return (
     <View style={styles.container}>
       <View style={styles.leftSection}>
          <Text>SCHEDULE</Text> 
          <Button 
              mode="contained"
              onPress={() => navigation.navigate('Request')}
          >
              + Request
          </Button>
          <Calendar 
              // ... calendar props 
          />
       </View>
       <View style={styles.rightSection}>
          {/*  Content for right side (time grid) - Needs building out */}
       </View>

       {/* ... Dialog code (similar to MUI version) ... */} 
     </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: "light-gray",
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});