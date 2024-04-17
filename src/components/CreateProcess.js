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

function CreateProcess() {
  const [processName, setProcessName] = useState("");
  const [sections, setSections] = useState([
    {
      name: "",
      roomType: "",
      staffType: "",
      timeDuration: "",

    },
  ]);
  const [isFormValid, setIsFormValid] = useState(false); // State to track form validity
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // adds procedures

    const proceduresToAdd = await Promise.all(sections.map(section =>

      axios.post("https://mediflow-cse416.onrender.com/createProcedure", {
        name: section.name,
        requiredRoomType: section.roomType,
        description: section.description,
        staffType: section.staffType,
        timeDuration: section.timeDuration
      })
    ));

    console.log("Added New Procedures", proceduresToAdd);

    // adds process

    await axios.post("https://mediflow-cse416.onrender.com/createProcess", {
      name: processName,
      components: proceduresToAdd.map(proc => proc.data) // assuming the server response includes the data you need
    }).then(console.log("Added Process"));

    navigate("/main/request");
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        name: "",
        description: "",
        roomType: "",
        staffType: "",
        timeDuration: "",
        requiredEquipment: []
      },
    ]);
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


    const allFieldsFilled = updatedSections.every((section) =>
      section.name && section.roomType && section.staffType && section.timeDuration
    );
    setIsFormValid(allFieldsFilled);
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
              <Typography variant="h8" sx={{ mt: 2 }}>
                Section {index + 1}
              </Typography>
              <FormControl fullWidth margin="normal" sx={{ mt: 1 }}>
                <InputLabel id={`sectionName-label-${index}`}>
                  Section Name
                </InputLabel>
                <Select
                  labelId={`sectionName-label-${index}`}
                  id={`sectionName${index}`}
                  value={section.name}
                  onChange={(e) =>
                    handleSectionChange(index, "name", e.target.value)
                  }
                  variant="outlined"
                >
                  <MenuItem value={"Pre Op"}>Pre Op</MenuItem>
                  <MenuItem value={"Surgery"}>Surgery</MenuItem>
                  <MenuItem value={"Recovery"}>Recovery</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" sx={{ mt: 1 }}>
                <InputLabel htmlFor={`descriptionName${index}`} id={`description-label-${index}`}>
                </InputLabel>
                <TextField
                  fullWidth
                  id={`descriptionName${index}`}
                  label="Description"
                  value={section.description}
                  onChange={(e) => handleSectionChange(index, "description", e.target.value)}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                id={`timeDuration${index}`}
                label="Time Duration (mins)"
                name={`timeDuration${index}`}
                type="number"
                value={section.timeDuration}
                onChange={(e) =>
                  handleSectionChange(index, "timeDuration", e.target.value)
                }
                sx={{ mt: 1 }}
                variant="outlined"
                inputProps={{
                  min: 5, // Minimum time duration
                  max: 600, // Maximum time duration
                  step: 5, // Increment by 5 minutes
                }}
              />
              <FormControl fullWidth margin="normal" sx={{ mt: 1 }}>
                <InputLabel id={`room-type-label-${index}`}>
                  Room Type
                </InputLabel>
                <Select
                  labelId={`room-type-label-${index}`}
                  id={`roomType${index}`}
                  value={section.roomType}
                  onChange={(e) =>
                    handleSectionChange(index, "roomType", e.target.value)
                  }
                  variant="outlined"
                >
                  <MenuItem value={"General"}>General</MenuItem>
                  <MenuItem value={"ICU"}>ICU</MenuItem>
                  <MenuItem value={"Surgery"}>Surgery</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" sx={{ mt: 1 }}>
                <InputLabel id={`staff-type-label-${index}`}>
                  Staff Type
                </InputLabel>
                <Select
                  labelId={`staff-type-label-${index}`}
                  id={`staffType${index}`}
                  value={section.staffType}
                  onChange={(e) =>
                    handleSectionChange(index, "staffType", e.target.value)
                  }
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
        disabled={!isFormValid}
      >
        Create Process
      </Button>
    </Box>
  );
}

export default CreateProcess;
