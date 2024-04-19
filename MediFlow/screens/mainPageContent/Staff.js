import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Title, IconButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; 
import { theme } from "../../core/theme";
import MainPageHeader from "../../components/MainPageHeader";
import { MainPageContext } from "../MainPageContext";

export default function Staff() {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const { setActiveComponent } = useContext(MainPageContext);

  const staffData = [
    { name: "Dr. Jane Doe", status: "ON DUTY", imageUri: "https://images.unsplash.com/photo-1500649708-c959990f5b44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFybyx8fHx8ZW1wbG95ZWVkJTIwdXNlciUyMHByb2ZpbGVy&auto=format&fit=crop&w=600&q=60" },
    { name: "Dr. Mike Jones", status: "ON CALL", imageUri: "https://images.unsplash.com/photo-1586283130344-dfe544944b2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFybyx8fHxtdHJhYmFuJTIwdXNlciUyMHByb2ZpbGVy&auto=format&fit=crop&w=600&q=60" },
    { name: "Dr. Sarah Lee", status: "NOT AVAILABLE", imageUri: "https://images.unsplash.com/photo-1518791841217-8f162f7d11c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFybyx8fHxzYW9tZW4lMjBxdWluZyUyMHByb2ZpbGVy&auto=format&fit=crop&w=600&q=60" },
  ];

  // ... useEffect axios call with data processing

  // ... handleSearch function

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleDateChange = (event) => {
    // Implementation to update selectedDate
  };

  const navigateToAddStaff = () => {
    setActiveComponent("AddStaff");
  };

  const getStatus = (schedule) => {
    
  };

  return (
    <ScrollView style={styles.container}> 
      <View style={styles.header}>
        <MainPageHeader>Staff</MainPageHeader>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Staff"
            value={search}
            onChangeText={handleSearch}
          />
          <IconButton icon="calendar-today" onPress={handleDateChange} />
        </View>
        <Button mode="contained" onPress={navigateToAddStaff}>
          Add Staff
        </Button>
      </View>
      <View style={styles.staffContent}>
      {["ON DUTY", "ON CALL", "NOT AVAILABLE"].map((status) => (
        <View style={styles.statusSection} key={status}> 
          <Text style={styles.statusTitle}>{status}</Text>
          <View style={styles.staffGrid}> 
            {staffData
              .map((staff) => (
                <View style={styles.staffItem} key={staff.name}> 
                  <Avatar.Image 
                    source={{ uri: staff.imageUri }}
                    size={60} 
                  />
                  <Text>{staff.name}</Text>
                </View>
              ))}
          </View>
        </View>
      ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: '20px',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  staffContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  staffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  staffItem: {
    width: '15%', 
    padding: 10,
    alignItems: 'center',
  },
});
