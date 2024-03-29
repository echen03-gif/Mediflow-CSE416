import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem, Button, Box, Typography } from '@mui/material';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function AddItem() {
    const navigate = useNavigate();
    const functions = getFunctions();
    const [equipmentData, setEquipmentData] = useState({
        equipmentID: '',
        name: '',
        type: '',
        status: '',
        location: '',
    });

    const handleChange = (e) => {
        setEquipmentData({ ...equipmentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const addTestData = httpsCallable(functions, 'addTestData');
        try {
            const newEquipmentData = {
            equipmentID: Number(equipmentData.equipmentID),
            Test: equipmentData.name,
            type: equipmentData.type,
            status: equipmentData.status,
            location: equipmentData.location,
            };

            const result = await addTestData(newEquipmentData);
            console.log("Document written with ID: ", result.id);
            navigate('/main/inventory');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error adding equipment');
        }
    };

    return (
        <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ '& .MuiTextField-root': { m: 1 }, maxWidth: '500px', margin: 'auto' }}
        >
        <Typography variant="h6" sx={{ m: 2 }}>
            Add Equipment
        </Typography>
        <TextField
            label="Equipment ID"
            variant="outlined"
            name="equipmentID"
            fullWidth
            value={equipmentData.equipmentID}
            onChange={handleChange}
            type="number"
        />
        <TextField
            label="Name"
            variant="outlined"
            name="name"
            fullWidth
            value={equipmentData.name}
            onChange={handleChange}
        />
        <TextField
            select
            label="Type"
            name="type"
            fullWidth
            value={equipmentData.type}
            onChange={handleChange}
        >
            {['surgical', 'diagnostic', 'general'].map((option) => (
            <MenuItem key={option} value={option}>
                {option}
            </MenuItem>
            ))}
        </TextField>
        <TextField
            select
            label="Status"
            name="status"
            fullWidth
            value={equipmentData.status}
            onChange={handleChange}
        >
            {['available', 'reserved', 'in-use'].map((option) => (
            <MenuItem key={option} value={option}>
                {option}
            </MenuItem>
            ))}
        </TextField>
        <TextField
            label="Location"
            variant="outlined"
            name="location"
            fullWidth
            value={equipmentData.location}
            onChange={handleChange}
        />
        <Button type="submit" variant="contained" sx={{ m: 1 }}>
            Submit
        </Button>
        </Box>
    );
};