import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CardActions,
  Modal,
} from "@mui/material";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const handleOpenModal = (appointment, procedure) => {
    setSelectedAppointment(appointment);
    setSelectedProcedure(procedure);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const modalBody = (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "auto",
        maxWidth: "80vw",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" component="h2" align="center" gutterBottom>
        Appointment Details
      </Typography>
      {selectedProcedure && (
        <>
          <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
            Procedure: {selectedProcedure.procedure.name}
          </Typography>
          <Typography variant="body1" align="center">
            {selectedProcedure.procedure.description}
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ mt: 1 }}>
            Date:{" "}
            {new Date(
              selectedProcedure.scheduledStartTime
            ).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle2" align="center">
            Time:{" "}
            {new Date(
              selectedProcedure.scheduledStartTime
            ).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ mb: 2 }}>
            Status: {selectedAppointment.status}
          </Typography>
        </>
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={handleCloseModal}>
          Close
        </Button>
      </Box>
    </Box>
  );

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const userId = sessionStorage.getItem("user");

      const response = await axios.post(
        `https://mediflow-cse416.onrender.com/profile-upload/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      sessionStorage.setItem("pfp", response.data.imagePath.split("/").pop());

      alert("Upload successful!");
      setUser({ ...user, profilePic: response.data.imagePath });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = sessionStorage.getItem("user");
      const userResponse = await axios.get(
        `https://mediflow-cse416.onrender.com/userID/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      setUser(userResponse.data);
      console.log("user data", userResponse.data);
    };

    const fetchAppointments = async () => {
      const userId = sessionStorage.getItem("user");
      const response = await axios.get(
        `https://mediflow-cse416.onrender.com/profileappt`,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      console.log("res", response.data);
      console.log("userId", userId)
      const filteredAppointments = response.data.filter(appointment => 
        appointment.patient.toString() === userId || 
        appointment.procedures.some(procedure => 
          procedure.staff.some(staff => staff.toString() === userId))
      );
      setAppointments(filteredAppointments);
      console.log("appts:",filteredAppointments);
    };

    fetchUser();
    fetchAppointments();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedAppointments = appointments.slice((page - 1) * 5, page * 5);

  const listItems = paginatedAppointments.flatMap((appointment) =>
  appointment.procedures.flatMap((procedure) => {
    if (procedure.staff.some((staff) => staff.toString() === user._id)) {
      return (
        <ListItem
          button
          key={`${appointment._id}-${procedure._id}`}
          onClick={() => handleOpenModal(appointment, procedure)}
        >
          <ListItemText
            primary={`Procedure: ${procedure.procedure.name} on ${new Date(
              procedure.scheduledStartTime
            ).toLocaleDateString()}`}
            secondary={`Status: ${appointment.status}`}
          />
        </ListItem>
      );
    }
    return null;
  })
).filter(Boolean);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Grid
      container
      spacing={3}
      sx={{ p: 3, height: "100vh", overflow: "auto" }}
    >
      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={`https://mediflow-cse416.onrender.com/uploads/${sessionStorage.getItem(
                  "pfp"
                )}`}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h5" data-testid="user-name">
                  {user.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  data-testid="user-role"
                >
                  {user.role}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              data-testid="user-email"
            >
              Email: {user.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Joined: {new Date(user.joined).toLocaleDateString()}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              data-testid="user.staffID"
            >
              Staff ID: {user.staffID}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              Edit Profile
            </Typography>
            <Avatar
              src={`https://mediflow-cse416.onrender.com/uploads/${sessionStorage.getItem(
                "pfp"
              )}`}
              sx={{ width: 90, height: 90, mb: 2 }}
              data-testid="profile-avatar"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" sx={{ mb: 2 }}>
                Choose File
              </Button>
            </label>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file}
              data-testid="upload-button"
            >
              Upload Image
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3, width: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Appointments
            </Typography>
            <List dense>
                {listItems.length > 0 ? (
                  listItems
                ) : (
                  <ListItem style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <ListItemText primary="No Appointments" primaryTypographyProps={{ textAlign: 'center' }} />
                  </ListItem>
                )}
              </List>

            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              {modalBody}
            </Modal>
            <CardActions sx={{ justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(appointments.length / 5)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </CardActions>
          </CardContent>
        </Card>
        <Card sx={{ mb: 3, width: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Schedule
            </Typography>
            {Object.entries(user.schedule).map(([day, shifts]) => (
              <Box key={day} sx={{ mb: 1 }}>
                <Typography variant="subtitle1">{day}:</Typography>
                {shifts.map((shift, index) => (
                  <Typography key={index} variant="body2" color="textSecondary">
                    {new Date(`1970-01-01T${shift.start}Z`).toLocaleTimeString(
                      "en-US",
                      { hour: "numeric", minute: "numeric", hour12: true }
                    )}{" "}
                    -{" "}
                    {new Date(`1970-01-01T${shift.end}Z`).toLocaleTimeString(
                      "en-US",
                      { hour: "numeric", minute: "numeric", hour12: true }
                    )}
                  </Typography>
                ))}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Profile;
