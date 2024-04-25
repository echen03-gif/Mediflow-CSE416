import React, { useState, useContext } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Avatar, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MainPageHeader from "../../components/MainPageHeader";
import { MainPageContext } from "../MainPageContext";

export default function Staff() {
	const navigation = useNavigation();
	const { setActiveComponent } = useContext(MainPageContext);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");

	const staffData = [
		{
			name: "Dr. Emily Smith",
			status: "ON DUTY",
			imageUri:
				"https://images.unsplash.com/photo-1579154203964-76a4f319d41b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		},
		{
			name: "Dr. John Brown",
			status: "ON DUTY",
			imageUri:
				"https://images.unsplash.com/photo-1573164574472-63df1bb1726b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		},
		{
			name: "Nurse Sarah Johnson",
			status: "ON CALL",
			imageUri:
				"https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		},
		{
			name: "Dr. Michael Williams",
			status: "ON CALL",
			imageUri:
				"https://images.unsplash.com/photo-1608136692670-f9f9ffe6c5de?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		},
		{
			name: "Dr. Angela Davis",
			status: "UNAVAILABLE",
			imageUri:
				"https://images.unsplash.com/photo-1563132337-f159f484226c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		},
		{
			name: "Nurse Robert Moore",
			status: "UNAVAILABLE",
			imageUri:
				"https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		},
	];

	const handlePress = (newStatus) => {
		setStatus(newStatus);
	};

	const handleSearch = (value) => {
		setSearch(value);
	};

	const navigateToAddStaff = () => {
		setActiveComponent("AddStaff");
	};

	return (
		<ScrollView style={styles.container}>
			<View>
				<MainPageHeader>Staff</MainPageHeader>
				<View style={styles.searchContainer}>
					<TextInput
						style={styles.searchInput}
						placeholder="Search Staff"
						value={search}
						onChangeText={handleSearch}
					/>
					<IconButton
						icon="calendar-today"
						size={20}
						onPress={() => {}}
					/>
				</View>
				<Button
					mode="contained"
					onPress={navigateToAddStaff}
					style={{ width: "15%", alignSelf: "flex-end" }}
				>
					Add Staff
				</Button>
			</View>
			<View style={styles.selectContainer}>
				<Button
					mode={status === "all" ? "contained" : "outlined"}
					onPress={() => handlePress("all")}
				>
					All
				</Button>
				<Button
					mode={status === "on duty" ? "contained" : "outlined"}
					onPress={() => handlePress("on duty")}
				>
					On Duty
				</Button>
				<Button
					mode={status === "on call" ? "contained" : "outlined"}
					onPress={() => handlePress("on call")}
				>
					On Call
				</Button>
				<Button
					mode={status === "unavailable" ? "contained" : "outlined"}
					onPress={() => handlePress("unavailable")}
				>
					Unavailable
				</Button>
			</View>
			<View style={styles.staffContent}>
				{status === "all" ? (
					["ON DUTY", "ON CALL", "UNAVAILABLE"].map((status) => (
						<View style={styles.statusSection} key={status}>
							<Text style={styles.statusTitle}>{status}</Text>
							<View style={styles.staffGrid}>
								{staffData
									.filter((staff) => staff.status === status)
									.map((staff) => (
										<View
											style={styles.staffItem}
											key={staff.name}
										>
											<Avatar.Image
												source={{ uri: staff.imageUri }}
												size={60}
											/>
											<Text>{staff.name}</Text>
										</View>
									))}
							</View>
						</View>
					))
				) : (
					<View style={styles.statusSection}>
						<Text style={styles.statusTitle}>
							{status.toUpperCase()}
						</Text>
						<View style={styles.staffGrid}>
							{staffData
								.filter(
									(staff) =>
										staff.status === status.toUpperCase()
								)
								.map((staff) => (
									<View
										style={styles.staffItem}
										key={staff.name}
									>
										<Avatar.Image
											source={{ uri: staff.imageUri }}
											size={60}
										/>
										<Text>{staff.name}</Text>
									</View>
								))}
						</View>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	searchInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
	},
	selectContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
		marginBottom: 20,
	},
	button: {
		marginHorizontal: 4,
		flex: 1,
	},
	staffContent: {
		flex: 1,
	},
	statusSection: {
		flex: 1,
		marginBottom: 20,
	},
	statusTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	staffGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
	},
	staffItem: {
		margin: 10,
		alignItems: "center",
		width: 100, // Ensuring items are not too wide to fit multiple in a row
	},
});
