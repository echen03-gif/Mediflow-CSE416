import React, { useState } from "react";
import  { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://mediflow-cse416.onrender.com/rooms',{ 
      headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }}).then(res => { setRooms(res.data) }).then(console.log('found rooms'));
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
    }).then(console.log("Added room")).then(navigate("/main/rooms"));
  };

  return (
    <Box sx={{ mt: 8, mx: 4 }}>
      <Typography variant="h6">Add Room</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="roomNumber"
          label="Room Number"
          name="roomNumber"
          autoComplete="room-number"
          autoFocus
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="room-type-label">Room Type</InputLabel>
          <Select
            labelId="room-type-label"
            id="roomType"
            value={roomType}
            label="Room Type"
            onChange={(e) => setRoomType(e.target.value)}
          >
            <MenuItem value={"General"}>General</MenuItem>
            <MenuItem value={"ICU"}>ICU</MenuItem>
            <MenuItem value={"Surgery"}>Surgery</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Room
        </Button>
      </form>
    </Box>
  );
};

export default AddRoom;
