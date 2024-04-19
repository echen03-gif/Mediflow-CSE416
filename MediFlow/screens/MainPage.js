import React, { useState, useContext } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import {
	Drawer,
	List,
	Avatar,
	Title,
	Caption,
	IconButton,
	PaperProvider,
	Appbar,
} from "react-native-paper";
import Logo from "../components/Logo";
import Schedule from "./mainPageContent/Schedule";
import Inventory from "./mainPageContent/Inventory";
import Staff from "./mainPageContent/Staff";
import Rooms from "./mainPageContent/Rooms";
import Inbox from "./mainPageContent/Inbox";
import AddStaff from "./mainPageContent/AddStaff";
import Chat from "./mainPageContent/Chat";
import AddRoom from "./mainPageContent/AddRoom";
import AddInventory from "./mainPageContent/AddInventory";
import { theme } from "../core/theme";
import { MainPageContext } from "./MainPageContext";
import RequestAppointment from "./mainPageContent/RequestAppointment";

const upcomingPatients = [
	{ name: "Patient 1", timeUntilTurn: "15 mins", stage: "Waiting" },
	{ name: "Patient 2", timeUntilTurn: "30 mins", stage: "Check-in" },
	{ name: "Patient 3", timeUntilTurn: "45 mins", stage: "Screening" },
];

const COMPONENT_MAP = {
	Schedule: Schedule,
	Inventory: Inventory,
	Staff: Staff,
	Rooms: Rooms,
	Inbox: Inbox,
	AddStaff: AddStaff,
	Chat: Chat,
	AddRoom: AddRoom,
	AddInventory: AddInventory,
	RequestAppointment: RequestAppointment,
};

export default function MainPage() {
	const { activeComponent, setActiveComponent } = useContext(MainPageContext);
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded);
	};

	const handleContentChange = (routeName) => () => {
		setActiveComponent(routeName);
	};

	const ActiveComponent = COMPONENT_MAP[activeComponent];

	return (
		<PaperProvider theme={theme}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<Drawer.Section
						style={[
							styles.sidebar,
							isSidebarExpanded
								? styles.expandedSidebar
								: styles.collapsedSidebar,
						]}
					>
						{isSidebarExpanded ? (
							<Text style={styles.logo}>MediFlow 🏥</Text>
						) : (
							<Text style={styles.logo}>🏥</Text>
						)}
						<List.Item
							title={isSidebarExpanded ? "Schedule" : ""}
							onPress={handleContentChange("Schedule")}
							left={(props) => (
								<List.Icon {...props} icon="calendar" />
							)}
							style={
								activeComponent === "Schedule"
									? styles.activeItem
									: null
							}
						/>
						<List.Item
							title={isSidebarExpanded ? "Inventory" : ""}
							onPress={handleContentChange("Inventory")}
							left={(props) => (
								<List.Icon {...props} icon="package-variant" />
							)}
							style={
								activeComponent === "Inventory"
									? styles.activeItem
									: null
							}
						/>
						<List.Item
							title={isSidebarExpanded ? "Staff" : ""}
							onPress={handleContentChange("Staff")}
							left={(props) => (
								<List.Icon {...props} icon="account-group" />
							)}
							style={
								activeComponent === "Staff"
									? styles.activeItem
									: null
							}
						/>
						<List.Item
							title={isSidebarExpanded ? "Rooms" : ""}
							onPress={handleContentChange("Rooms")}
							left={(props) => (
								<List.Icon {...props} icon="home" />
							)}
							style={
								activeComponent === "Rooms"
									? styles.activeItem
									: null
							}
						/>
						<List.Item
							title={isSidebarExpanded ? "Inbox" : ""}
							onPress={handleContentChange("Inbox")}
							left={(props) => (
								<List.Icon {...props} icon="email" />
							)}
							style={
								activeComponent === "Inbox"
									? styles.activeItem
									: null
							}
						/>
						<IconButton
							icon={
								isSidebarExpanded
									? "chevron-left"
									: "chevron-right"
							}
							onPress={toggleSidebar}
							style={styles.toggleButton}
						/>
					</Drawer.Section>

					<View
						style={{
							flex: 1,
							backgroundColor: "white",
							width: "100%",
						}}
					>
						<Appbar.Header style={{ backgroundColor: "#d3d3d3" }}>
							<Avatar.Image
								style={styles.avatar}
								source={require("../assets/profilePic.jpeg")}
							/>
							<Appbar.Content title="Dr. Jane Doe" />
							{upcomingPatients.map((patient, index) => (
								<View key={index}>
									<Text>{patient.name}</Text>
									<Text>{`Time until turn: ${patient.timeUntilTurn}`}</Text>
									<Text>{`Stage: ${patient.stage}`}</Text>
								</View>
							))}
						</Appbar.Header>
						{ActiveComponent && <ActiveComponent />}
					</View>
				</View>
			</SafeAreaView>
		</PaperProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	},
	sidebar: {
		backgroundColor: theme.colors.secondary,
		alignItems: "center",
		width: "16%",
	},
	expandedSidebar: {
		width: "16%",
	},
	collapsedSidebar: {
		width: "5%",
	},
	toggleButton: {
		marginBottom: 15,
	},
	logo: {
		fontSize: 36,
		color: "black",
		fontWeight: "bold",
		paddingVertical: 12,
	},
	activeItem: {
		backgroundColor: "orange",
	},
});