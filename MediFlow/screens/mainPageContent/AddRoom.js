import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Picker, Button } from 'react-native'; 
import { Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { MainPageContext } from "../MainPageContext";
import { PickerIOS } from "@react-native-picker/picker";

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [rooms, setRooms] = useState([]);
  const { setActiveComponent } = useContext(MainPageContext);

  useEffect(() => {
    axios.get('https://mediflow-cse416.onrender.com/rooms')
      .then(res => setRooms(res.data)) 
      .then(console.log('found rooms'));
   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomExists = rooms.some((room) => room.name === roomNumber);
    if (roomExists) {
      alert("Room with this number already exists.");
      return;
    }

    await axios.post("https://mediflow-cse416.onrender.com/createRoom", {
      name: roomNumber,
      type: roomType,
      roomID: rooms.length + 1, 
      status: "Open" 
    })
      .then(console.log("Added room"))
      .then(() => {setActiveComponent})
      .then(setActiveComponent("Rooms"));
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
					Add Room
				</Text>

				<TextInput
					style={{ marginBottom: 15 }}
					placeholder="Room Number"
					value={roomNumber}
					onChangeText={(text) => setRoomNumber(text)}
				/>

				<PickerIOS
					selectedValue={roomType}
					style={{ marginBottom: 15 }}
					onValueChange={(itemValue) => setRoomType(itemValue)}
				>
					<PickerIOS.Item label="General" value="General" />
					<PickerIOS.Item label="ICU" value="ICU" />
					<PickerIOS.Item label="Surgery" value="Surgery" />
				</PickerIOS>

				<Button title="Add Room" onPress={handleSubmit} />
			</View>
		</PaperProvider>
  );
};

export default AddRoom;
