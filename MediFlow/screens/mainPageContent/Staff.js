import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; 
import { theme } from "../../core/theme";
import MainPageHeader from "../../components/MainPageHeader";

export default function Staff() {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");

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

  const navigateToAddStaff = () => {
    navigation.navigate("AddStaff"); 
  };

  const getStatus = (schedule) => {
    // ... Your status calculation logic
  };

  return (
    <ScrollView style={styles.container}> 
      <View style={styles.header}>
        <MainPageHeader>Staff</MainPageHeader>
        <Button 
          title="Add Staff" 
          style={{
            backgroundColor: theme.colors.primary,

          }}
          onPress={navigateToAddStaff} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Staff"
          value={search}
          onChange={handleSearch}
        />
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
    width: '100%',
    maxWidth: 340,
  },
  header: {
    flexDirection: 'column', // Arrange header elements horizontally
    justifyContent: 'space-between', // Align left and right sides
    alignItems: 'center', // Center elements vertically
    marginBottom: 20, // Add bottom margin for spacing
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold', // Emphasize title text
  },
  searchInput: {
    borderCurve: 'circular',
    borderColor: 'black',
  },
  statusSection: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold', // Emphasize status titles
  },
  staffGrid: {
    flexDirection: 'row', // Arrange staff items horizontally
    flexWrap: 'wrap', // Allow items to wrap to new lines if needed
  },
  staffItem: {
    width: '50%', // Set width for each staff item (adjust as needed)
    padding: 10, // Add padding for spacing
    alignItems: 'center', // Center staff information vertically
  },
});
