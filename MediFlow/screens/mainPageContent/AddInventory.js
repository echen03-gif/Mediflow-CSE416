import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, TextInput, Button } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { PickerIOS } from "@react-native-picker/picker";
import { MainPageContext } from "../MainPageContext";

export default function AddInventory() {
	const [name, setName] = useState("");
	const [room, setRoom] = useState("");
	const [equipmentLocation, setLocation] = useState("");
	const [equipmentCategory, setCategory] = useState("");
	const [equipmentHeadList, setEquipmentHead] = useState([]);
	const [rooms, setRooms] = useState("");
  const { setActiveComponent } = useState(MainPageContext);


  useEffect(() => {
		const fetchEquipmentHead = async () => {
			try {
				const response = await axios.get(
					"https://mediflow-cse416.onrender.com/equipmentHead"
				);
				setEquipmentHead(response.data);
			} catch (error) {
				console.error("Error fetching equipment heads:", error);
				// Handle error gracefully, display message to the user
			}
		};
		fetchEquipmentHead();
  }, []); 

	useEffect(() => {
		axios
			.get("https://mediflow-cse416.onrender.com/rooms")
			.then((res) => setRooms(res.data))
			.then(console.log("found rooms")); // Use more descriptive logging
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const equipmentHeadExists = equipmentHeadList.some(
			(object) => object.name === name
		);

		if (equipmentHeadExists) {
			let newItem = await axios
				.post("https://mediflow-cse416.onrender.com/createEquipment", {
					location: equipmentLocation,
					name: name,
					type: equipmentCategory,
				})
				.then(console.log("Added Equipment"));

			await axios
				.put(
					"https://mediflow-cse416.onrender.com/changeEquipmentHead",
					{
						name: name,
						equipment: newItem.data,
					}
				)
				.then(console.log("Updated Head"));
		} else {
			await axios
				.post(
					"https://mediflow-cse416.onrender.com/createEquipmentHead",
					{
						name: name,
						type: equipmentCategory,
					}
				)
				.then(console.log("Added Equipment Head"));

			let newItem = await axios
				.post("https://mediflow-cse416.onrender.com/createEquipment", {
					location: equipmentLocation,
					name: name,
					type: equipmentCategory,
				})
				.then(console.log("Added Equipment"));

			await axios
				.put(
					"https://mediflow-cse416.onrender.com/changeEquipmentHead",
					{
						name: name,
						equipment: newItem.data,
					}
				)
				.then(console.log("Updated Head"));
		}

		setActiveComponent("Inventory")
	};

	return (
		<PaperProvider>
			<View style={{ padding: 20 }}>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						marginBottom: 15,
					}}
				>
					Add Inventory Item
				</Text>

				<TextInput
					style={{
						marginBottom: 15,
						height: 50,
						fontSize: 18,
					}}
					placeholder="Item Name"
					value={name}
					onChangeText={(text) => setName(text)}
				/>

				<TextInput
					style={{
						marginBottom: 15,
						height: 50,
						fontSize: 18,
					}}
					placeholder="Room Number"
					value={room}
					onChangeText={(text) => setRoom(text)}
				/>

				<PickerIOS
					selectedValue={equipmentCategory}
					style={{ marginBottom: 15 }}
					onValueChange={(itemValue) => setCategory(itemValue)}
				>
					<PickerIOS.Item label="Cardiology" value="Cardiology" />
					<PickerIOS.Item label="Radiology" value="Radiology" />
					<PickerIOS.Item label="Orthopedics" value="Orthopedics" />
					<PickerIOS.Item label="Surgery" value="Surgery" />
					<PickerIOS.Item label="Pharmacy" value="Pharmacy" />
					<PickerIOS.Item label="Laboratory" value="Laboratory" />
					<PickerIOS.Item label="Neurology" value="Neurology" />
				</PickerIOS>

				<Button title="Add Item" onPress={handleSubmit} />
			</View>
		</PaperProvider>
	);
};