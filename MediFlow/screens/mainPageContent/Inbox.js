import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import {
	DataTable,
	Avatar,
	List,
	Caption,
	Title,
	Button,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MainPageHeader from "../../components/MainPageHeader";
import { MainPageContext } from "../MainPageContext";

const peopleData = [
	{
		id: 1,
		name: "Dr. Jane Doe",
		message: "Test results are ready...",
		imageUri:
			"https://images.unsplash.com/photo-1500649708-c959990f5b44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFybyx8fHx8ZW1wbG95ZWVkJTIwdXNlciUyMHByb2ZpbGVy&auto=format&fit=crop&w=600&q=60",
	},
	{
		id: 2,
		name: "Dr. Mike Jones",
		message: "Follow up appointment...",
		imageUri:
			"https://images.unsplash.com/photo-1586283130344-dfe544944b2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFybyx8fHxtdHJhYmFuJTIwdXNlciUyMHByb2ZpbGVy&auto=format&fit=crop&w=600&q=60",
	},
	// ... Add more sample data
];

export default function Inbox() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [search, setSearch] = useState("");
	const [peopleList, setPeople] = useState(peopleData); // Initialize with sample data
	const navigation = useNavigation();
	const { setActiveComponent } = useContext(MainPageContext);

	useEffect(() => {
		// Replace with your actual API call
	}, []);

	const handleSearch = (event) => {
		setSearch(event.nativeEvent.text);
	};

	const handleRowClick = (personId) => {
		setActiveComponent("Chat");
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10)); // Currently unused
		setPage(0);
	};

	const handleChatClick = () => {
		
	};

	const filteredPeople = peopleList.filter((person) =>
		person.name.toLowerCase().includes(search.toLowerCase())
	);

	const paginatedPeople = filteredPeople.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<ScrollView style={styles.container}>
			<MainPageHeader>Inbox</MainPageHeader>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search"
					value={search}
					onChangeText={handleSearch}
				/>
			</View>
			<Button mode="contained" onPress={() => handleChatClick()}>
				New Chat
			</Button>
			<DataTable style={styles.dataTable}>
				<DataTable.Header>
					<DataTable.Title>Profile</DataTable.Title>
					<DataTable.Title>Name</DataTable.Title>
					<DataTable.Title>Last Message</DataTable.Title>
				</DataTable.Header>

				{paginatedPeople.map((person) => (
					<DataTable.Row
						key={person.id}
						onPress={() => handleRowClick(person.id)}
					>
						<DataTable.Cell>
							<Avatar.Image
								size={50}
								source={{ uri: person.imageUri }}
							/>
						</DataTable.Cell>
						<DataTable.Cell>{person.name}</DataTable.Cell>
						<DataTable.Cell>{person.message}</DataTable.Cell>
					</DataTable.Row>
				))}

				<DataTable.Pagination
					page={page}
					numberOfPages={Math.ceil(
						filteredPeople.length / rowsPerPage
					)}
					onPageChange={handleChangePage}
					label={`${page * rowsPerPage + 1}-${Math.min(
						(page + 1) * rowsPerPage,
						filteredPeople.length
					)} of ${filteredPeople.length}`}
					showFastPaginationControls
				/>
			</DataTable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	searchInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 5,
		padding: 5,
		marginRight: 10,
	},
	dataTable: {
		backgroundColor: "white", // Optional background color for better contrast
	},
});
