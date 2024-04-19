import React, { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import {
	Provider as PaperProvider,
	Button,
	List,
	Appbar,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { PickerIOS } from "@react-native-picker/picker";

export default function RequestAppointment() {
  const [patientName, setPatientName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [process, setProcess] = useState("");

  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [procedureList, setProcedureList] = useState([]);

  const [staffSelections, setStaffSelections] = useState({});
  const [roomSelections, setRoomSelections] = useState({});

	const navigation = useNavigation();


  useEffect(() => {
		axios.get("https://mediflow-cse416.onrender.com/users").then((res) => {
			setUsersList(res.data);
		});

		axios
			.get("https://mediflow-cse416.onrender.com/rooms")
			.then((res) => {
				setRooms(res.data);
			})
			.then(console.log("found rooms"));

		axios
			.get("https://mediflow-cse416.onrender.com/processes")
			.then((res) => {
				setProcessList(res.data);
			});

		axios
			.get("https://mediflow-cse416.onrender.com/procedures")
			.then((res) => {
				setProcedureList(res.data);
			});

		axios
			.get("https://mediflow-cse416.onrender.com/equipment")
			.then((res) => {
				setEquipmentList(res.data);
			});
  }, []);

	const [showDatePicker, setShowDatePicker] = useState(false);
	const [dateMode, setDateMode] = useState("date"); // For start & end time

	const handleStartChange = (event, date) => {
		setShowDatePicker(false);
		// Ensure date is selected before setting
		if (date) {
			setStartTime(date.toISOString());
		}
	};

	const handleEndChange = (event, date) => {
		setShowDatePicker(false);
		if (date) {
			setEndTime(date.toISOString());
		}
	};

	const handleCreateProcess = () => {
		navigation.navigate("/main/createprocess");
	};

	const handleSubmit = async (e) => {
		// ... your submit logic
	};

	// ... handleStaffChange, handleEquipmentChange, handleRoomChange functions

	return (
		<PaperProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<Appbar.Header>
					<Appbar.Content title="Request Appointment" />
				</Appbar.Header>
				<ScrollView
					contentContainerStyle={{ padding: 20, flexGrow: 1 }}
				>
					<TextInput
						style={{ marginBottom: 15 }}
						placeholder="Patient Name"
						value={patientName}
						onChangeText={setPatientName}
					/>

					<TouchableOpacity
						onPress={() => {
							setShowDatePicker(true);
							setDateMode("date");
						}}
					>
						<Text style={{ marginBottom: 10, color: "blue" }}>
							Scheduled Start Time
						</Text>
						<Text>{startTime.slice(0, 10)}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {
							setShowDatePicker(true);
							setDateMode("date");
						}}
					>
						<Text style={{ marginBottom: 10, color: "blue" }}>
							Scheduled End Time
						</Text>
						<Text>{endTime.slice(0, 10)}</Text>
					</TouchableOpacity>

					{showDatePicker && (
						<DateTimePicker
							value={new Date()}
							mode={dateMode}
							is24Hour={true}
							onChange={
								dateMode === "date"
									? handleStartChange
									: handleEndChange
							}
						/>
					)}

					{/* Process Picker */}
					<View style={{ marginBottom: 15 }}>
						<PickerIOS
							selectedValue={process}
							onValueChange={(value) => setProcess(value)}
						>
							{processList.map((process) => (
								<PickerIOS.Item
									key={process._id}
									label={process.name}
									value={process}
								/>
							))}
						</PickerIOS>
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 15,
						}}
					>
						<Button
							mode="contained"
							onPress={handleCreateProcess}
							style={{ flex: 1, marginRight: 5 }}
						>
							Create Process
						</Button>
					</View>

					{/* Staff, Room, Equipment Selection (refactor this area) */}
					{process &&
						process.components.map((procedure) => (
							<View style={{ marginBottom: 20 }} key={procedure}>
								<Text style={{ fontWeight: "bold" }}>
									{
										procedureList.find(
											(item) => item._id === procedure
										).name
									}
								</Text>
								{/* Lists/Pickers for Staff, Room, Equipment will need further customization */}
							</View>
						))}

					<Button mode="contained" onPress={handleSubmit}>
						Submit
					</Button>
				</ScrollView>
			</SafeAreaView>
		</PaperProvider>
	);
}
