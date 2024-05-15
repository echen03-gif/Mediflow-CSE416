import React, { useState, useEffect } from "react";
import axios from 'axios';
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


const AddInventory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [equipmentLocation, setLocation] = useState("");
  const [equipmentCategory, setCategory] = useState("");
  const [equipmentHeadList, setEquipmentHead] = useState([]);
  const [rooms, setRooms] = useState([]);
  const departments = ["Cardiology", "Radiology", "Oncology", "Neurology", "Pediatrics", "Orthopedics"];

  // DB API

  useEffect(() => {

    axios.get('https://mediflow-cse416.onrender.com/equipmentHead', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setEquipmentHead(res.data) }).then(console.log('found rooms'));

    axios.get('https://mediflow-cse416.onrender.com/rooms', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setRooms(res.data) }).then(console.log('found rooms'));

  }, []);

  // Functions

  const handleSubmit = async (e) => {
    e.preventDefault();

    const equipmentHeadExists = equipmentHeadList.some((object) => object.name === name);
    if (equipmentHeadExists) {

      let newItem = await axios.post("https://mediflow-cse416.onrender.com/createEquipment", {
        location: equipmentLocation,
        name: name,
        type: equipmentCategory,

      }, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(console.log("Added Equipment"));

      await axios.put("https://mediflow-cse416.onrender.com/changeEquipmentHead", {

        name: name,
        equipment: newItem.data

      }, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(console.log("Updated Head"));

    }
    else {

      await axios.post("https://mediflow-cse416.onrender.com/createEquipmentHead", {

        name: name,
        type: equipmentCategory

      }, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(console.log("Added Equipment Head"));


      let newItem = await axios.post("https://mediflow-cse416.onrender.com/createEquipment", {
        location: equipmentLocation,
        name: name,
        type: equipmentCategory,

      }, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(console.log("Added Equipment"));

      await axios.put("https://mediflow-cse416.onrender.com/changeEquipmentHead", {

        name: name,
        equipment: newItem.data,

      }, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(console.log("Updated Head"));

    }


    navigate("/main/inventory");
  };

  // Display

  return (
    <Box sx={{ mt: 8, mx: 4 }}>
      <Typography variant="h6">Add Inventory Item</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Item Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="item-name"

        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            id="location"
            value={equipmentLocation}
            label="Location"
            onChange={(e) => setLocation(e.target.value)}
            data-testid="location"

          >
            {rooms.map((room) =>
              <MenuItem value={room}>{room.name}</MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={equipmentCategory}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
            data-testid="category"

          >
            {departments.map((department) => (
              <MenuItem value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          data-testid="submit-button"

        >
          Add Item
        </Button>
      </form>
    </Box>
  );
};

export default AddInventory;
