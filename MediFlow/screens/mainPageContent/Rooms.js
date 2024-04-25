import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { DataTable, Avatar, IconButton, Button } from 'react-native-paper';
import MainPageHeader from '../../components/MainPageHeader';
import { MainPageContext } from "../MainPageContext";

export default function Rooms() {
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(2); // Initial rows per page 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const { setActiveComponent } = useContext(MainPageContext);
  const roomsData = [
    { id: 1, name: '121', type: 'Cardiology', status: 'Patient 15' },
    { id: 2, name: '122', type: 'Neurology', status: 'Patient 7' },
    { id: 3, name: '123', type: 'Radiology', status: 'N/A' },
    { id: 4, name: '124', type: 'Radiology', status: 'N/A' },
    { id: 5, name: '125', type: 'ICU', status: 'Patient 3' },
    { id: 6, name: '126', type: 'Cardiology', status: 'N/A' },
  ];

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleDateChange = (event) => {
    // Implementation to update selectedDate
  };

  const navigateToAddRoom = () => {
    setActiveComponent("AddRoom");
  };

  const handleChangePage = (event, newPage) => {
    // Implementation to update page
  };

  const filteredRooms = roomsData.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRooms = filteredRooms.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isRoomAvailable = (roomName, date) => {
    // Simulate room availability based on even-numbered room names for now
    return roomName % 2 === 0;
  };

  return (
		<ScrollView style={styles.container}>
			<View>
				<MainPageHeader>Room Availability</MainPageHeader>
				<View style={styles.searchContainer}>
					<TextInput
						style={styles.searchInput}
						placeholder="Search Rooms"
						value={search}
						onChangeText={handleSearch}
					/>
					<IconButton
						icon="calendar-today"
						onPress={handleDateChange}
					/>
				</View>
				<Button
					mode="contained"
					onPress={navigateToAddRoom}
					style={{
							width: "15%",
							alignSelf: "flex-end",
					}}
				>
					Add Room
				</Button>
			</View>
			<DataTable style={styles.dataTable}>
				<DataTable.Header>
					<DataTable.Title>Room #</DataTable.Title>
					<DataTable.Title align="right">Room Type</DataTable.Title>
					<DataTable.Title align="right">
						Assigned Appointment
					</DataTable.Title>
				</DataTable.Header>
				{/* Render the room list. Removed unnecessary nesting for readability*/}
				{paginatedRooms.map((room) => (
					<DataTable.Row key={room.id}>
						<DataTable.Cell>
							<Avatar.Icon
								size={30}
								icon={
									isRoomAvailable(room.name, selectedDate)
										? "check"
										: "close"
								}
								style={{
									backgroundColor: isRoomAvailable(
										room.name,
										selectedDate
									)
										? "green"
										: "red",
								}}
							/>
						</DataTable.Cell>
						<DataTable.Cell>{room.name}</DataTable.Cell>
						<DataTable.Cell align="right">
							{room.type}
						</DataTable.Cell>
						<DataTable.Cell align="right">
							{room.status}
						</DataTable.Cell>
					</DataTable.Row>
				))}

				<DataTable.Pagination
					page={page}
					numberOfPages={Math.ceil(
						filteredRooms.length / rowsPerPage
					)}
					onPageChange={handleChangePage}
					label={`${page * rowsPerPage + 1}-${Math.min(
						(page + 1) * rowsPerPage,
						filteredRooms.length
					)} of ${filteredRooms.length}`}
					showFastPaginationControls
				/>
			</DataTable>
		</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
  dataTable: {
    marginTop: 10,
  },
});