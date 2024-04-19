import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Switch, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'; 
import { Picker } from '@react-native-picker/picker'
import MainPageHeader from '../../components/MainPageHeader';

export default function AddStaff() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [position, setPosition] = useState(""); 
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(new Date()); 

    // Initialize shifts state
    const [shifts, setShifts] = useState({
        Monday: { start: new Date(), end: new Date(), isWorking: false },
        Tuesday: { start: new Date(), end: new Date(), isWorking: false },
        Wednesday: { start: new Date(), end: new Date(), isWorking: false },
        Thursday: { start: new Date(), end: new Date(), isWorking: false },
        Friday: { start: new Date(), end: new Date(), isWorking: false },
        Saturday: { start: new Date(), end: new Date(), isWorking: false },
        Sunday: { start: new Date(), end: new Date(), isWorking: false },
    });

    return (
        <>
            <MainPageHeader>Add Staff</MainPageHeader>
            <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName} 
            /> 
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail} 
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword} 
                secureTextEntry={true} 
            />

            <Picker
            selectedValue={position}
            onValueChange={setPosition}
            style={styles.picker}
            > 
                <Picker.Item label="Nurse" value="Nurse" />
                <Picker.Item label="Doctor" value="Doctor" />
                <Picker.Item label="Janitor" value="Janitor" />
                <Picker.Item label="Administrator" value="Administrator" />
            </Picker>

            {Object.keys(shifts).map((day) => (
                <View style={styles.switchContainer} key={day}>
                    <Text>Scheduled To Work ({day})</Text> 
                    <Switch
                        value={shifts[day].isWorking} 
                        onValueChange={(value) => 
                            setShifts({ ...shifts, [day]: { ...shifts[day], isWorking: value } })
                        }
                    />
                {shifts[day].isWorking  && (
                    <>
                        <DateTimePicker 
                            mode="time"
                            value={new Date()} 
                            onChange={(event, time) => {
                                if (time) { // Check if a time was selected
                                    const formattedTime = time.getHours() + ":" + time.getMinutes(); 
                                    setShifts({ ...shifts, [day]: { ...shifts[day], start: formattedTime } });
                                }
                            }}
                        /> 
                        <DateTimePicker 
                            mode="time"
                            value={new Date()} 
                            onChange={(event, time) => {
                                if (time) { // Check if a time was selected
                                    const formattedTime = time.getHours() + ":" + time.getMinutes(); 
                                    setShifts({ ...shifts, [day]: { ...shifts[day], start: formattedTime } });
                                }
                            }}
                        /> 
                    </>
                )}
                </View>
            ))}

        </>
    );
};

const styles = StyleSheet.create({
  container: { // Optional container for overall layout
    flex: 1,
    padding: 20, 
    backgroundColor: '#fff' // White background 
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',  
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,  
  },
  picker: {
    marginBottom: 15,
  },  
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  }, 
});
