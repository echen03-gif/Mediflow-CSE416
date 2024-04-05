import React, { useState } from "react";
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
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/main/inventory");
  };

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
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="quantity"
          label="Quantity"
          name="quantity"
          type="number"
          autoComplete="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            id="location"
            value={location}
            label="Location"
            onChange={(e) => setLocation(e.target.value)}
          >
            <MenuItem value={"Location 1"}>Location 1</MenuItem>
            <MenuItem value={"Location 2"}>Location 2</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value={"Category 1"}>Category 1</MenuItem>
            <MenuItem value={"Category 2"}>Category 2</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Item
        </Button>
      </form>
    </Box>
  );
};

export default AddInventory;
