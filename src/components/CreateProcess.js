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

function CreateProcess(){
  const [processName, setProcessName] = useState("");
  const [sections, setSections] = useState([{ 
    name: '', 
    roomType: '', 
    staffType: '', 
    timeDuration: '' 
  }]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/main/request");
  };

  const handleAddSection = () => {
    setSections([...sections, { 
      name: '', 
      roomType: '', 
      staffType: '', 
      timeDuration: '' 
    }]);
  };

  const handleDeleteSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  return (
    <Box sx={{ mt: 8, mx: 4 }}>
      <Typography variant="h6">Create Process</Typography>
      <Box sx={{ mb: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="processName"
            label="Process Name"
            name="processName"
            autoComplete="process-name"
            autoFocus
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
          />
        </Box>
      <Box
        sx={{
          backgroundColor: "#E6F7FF",
          borderRadius: "8px",
          maxHeight: "50vh", // Set a fixed height
          overflowY: "auto", // Enable vertical scrolling
          mt: 2,
          p: 2,
        }}
      >
        
        <form onSubmit={handleSubmit}>
          {sections.map((section, index) => (
            <div className="Section" key={index}>
              <Typography variant="h8" sx={{ mt: 2 }}>Section {index + 1}</Typography> 
              <TextField
                margin="normal"
                required
                fullWidth
                id={`sectionName${index}`}
                label="Section Name"
                name={`sectionName${index}`}
                autoComplete={`section-name-${index}`}
                value={section.name}
                onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
                sx={{ mt: 1 }}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id={`timeDuration${index}`}
                label="Time Duration (mins)"
                name={`timeDuration${index}`}
                type="number"
                value={section.timeDuration}
                onChange={(e) => handleSectionChange(index, 'timeDuration', e.target.value)}
                sx={{ mt: 1 }}
                variant="outlined"
              />
              <FormControl fullWidth margin="normal" sx={{ mt: 1 }}>
                <InputLabel id={`room-type-label-${index}`}>Room Type</InputLabel>
                <Select
                  labelId={`room-type-label-${index}`}
                  id={`roomType${index}`}
                  value={section.roomType}
                  label="Room Type"
                  onChange={(e) => handleSectionChange(index, 'roomType', e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value={"General"}>General</MenuItem>
                  <MenuItem value={"ICU"}>ICU</MenuItem>
                  <MenuItem value={"Surgery"}>Surgery</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" sx={{ mt: 1 }}>
                <InputLabel id={`staff-type-label-${index}`}>Staff Type</InputLabel>
                <Select
                  labelId={`staff-type-label-${index}`}
                  id={`staffType${index}`}
                  value={section.staffType}
                  label="Staff Type"
                  onChange={(e) => handleSectionChange(index, 'staffType', e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value={"Doctor"}>Doctor</MenuItem>
                  <MenuItem value={"Surgeon"}>Surgeon</MenuItem>
                  <MenuItem value={"Nurse"}>Nurse</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="button"
                variant="outlined"
                onClick={() => handleDeleteSection(index)}
                sx={{ mt: 1, ml: 1 }}
              >
                Delete Section
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="contained"
            onClick={handleAddSection}
            sx={{ mt: 2, mb: 1 }}
          >
            Add Section
          </Button>
        </form>
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Create Process
      </Button>
    </Box>
  );
};

export default CreateProcess;
