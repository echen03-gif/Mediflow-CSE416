import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem, Button, Box, Typography } from '@mui/material';

export default function AddItem() {
    const navigate = useNavigate();
    const [equipmentData, setEquipmentData] = useState({
        equipmentID: '',
        name: '',
        type: '',
        status: '',
        location: '',
    });

    // Functions

    const handleChange = (e) => {
        setEquipmentData({ ...equipmentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/main/inventory');
    };

    // Display

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
                data-testid="equipment-id"

            />
            <TextField
                label="Name"
                variant="outlined"
                name="name"
                fullWidth
                value={equipmentData.name}
                onChange={handleChange}
                data-testid="name"

            />
            <TextField
                select
                label="Type"
                name="type"
                fullWidth
                value={equipmentData.type}
                onChange={handleChange}
                data-testid="type"

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
                data-testid="status"

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
                data-testid="location"

            />
            <Button type="submit" variant="contained" sx={{ m: 1 }} data-testid="submit-button">
                Submit
            </Button>
        </Box>
    );
};