import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Agenda } from "react-native-calendars";

export default function Schedule() {
	const [events, setEvents] = useState([
		{ date: "2024-06-22", name: "Medication 1", time: "9:00 AM" },
		{ date: "2024-06-23", name: "Doctor Appointment", time: "2:30 PM" },
		{ date: "2024-06-26", name: "Lunch Meeting", time: "12:00 PM" },
	]);
	const items = {
		"2024-06-22": [{ name: "Event 1", startTime: "9:00 AM" }],
		"2024-06-23": [{ name: "Event 2", startTime: "2:30 PM" }],
	};


	const renderItem = (item) => {
		return (
			<View style={styles.eventItem}>
				<Text style={styles.eventName}>{item.name}</Text>
				<Text style={styles.eventTime}>{item.time}</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Agenda
				items={items}
				renderItem={renderItem}
				rowHasChanged={(r1, r2) => r1.name !== r2.name} // Update this condition if needed
				renderEmptyDate={() => (
					<Text style={styles.emptyDate}>No events scheduled</Text>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	eventItem: {
		backgroundColor: "lightblue",
		padding: 10,
		marginBottom: 10,
	},
	eventName: {
		fontSize: 16,
		fontWeight: "bold",
	},
	eventTime: {},
	emptyDate: {
		textAlign: "center",
		marginTop: 15,
	},
});