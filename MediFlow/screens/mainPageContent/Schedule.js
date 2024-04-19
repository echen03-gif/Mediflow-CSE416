import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; 
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils
} from 'react-native-calendars';
import MainPageHeader from '../../components/MainPageHeader';
import moment from 'moment'; // Make sure to install moment via npm or yarn

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
  
  const eventsByDate = events.filter(event => 
    moment(event.date).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD')
  );

  // Set INITIAL_TIME to the current time
  const INITIAL_TIME = moment().format('HH:mm:ss');

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    //let calendarApi = calendarRef.current.getApi();
    //calendarApi.changeView('timeGridDay', arg.date);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const navigateToAddAppointment = () => {
    // Implement navigation logic here
  };

  return (
     <Surface style={styles.container}>
       <View style={styles.leftSection}>
          <MainPageHeader>SCHEDULE</MainPageHeader> 
          <Button mode="contained" onPress={navigateToAddAppointment}>
            Add Appointment
          </Button>
          <CalendarProvider
            date={selectedDate}
            onDateChanged={this.onDateChanged}
            onMonthChange={this.onMonthChange}
            showTodayButton
            disabledOpacity={0.6}
            // numberOfDays={3}
            style={{width: '100%'}}
          >
            <ExpandableCalendar
              firstDay={1}
              //leftArrowImageSource={require('../img/previous.png')}
              //rightArrowImageSource={require('../img/next.png')}
              markedDates={this.marked}
            />
            <TimelineList
              events={eventsByDate}
              timelineProps={this.timelineProps}
              showNowIndicator
              // scrollToNow
              scrollToFirst
              initialTime={INITIAL_TIME}
            />
          </CalendarProvider>
       </View>
       <View style={styles.rightSection}>
          {/*  Content for right side (time grid) - Needs building out */}
       </View>

       {/* ... Dialog code (similar to MUI version) ... */} 
     </Surface>
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: '3',
  },
});