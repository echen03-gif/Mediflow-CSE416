import React from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import Schedule from "./Schedule";
import Inventory from "./Inventory";
import AddItem from "./AddItem";
import Request from "./RequestAppointment";
import Rooms from "./Rooms";
import Staff from "./Staff";
import Inbox from "./Inbox";
import ChatScreen from './ChatScreen';
import AddStaff from "./AddStaff";
import AddInventory from "./AddInventory";
import AddRoom from "./AddRoom";
import CreateProcess from "./CreateProcess";


// Mock array of upcoming patients
const upcomingPatients = [
  { name: "Patient 1", timeUntilTurn: "15 mins", stage: "Waiting" },
  { name: "Patient 2", timeUntilTurn: "30 mins", stage: "Check-in" },
  { name: "Patient 3", timeUntilTurn: "45 mins", stage: "Screening" },
];

export default function MainPage() {
  const drawerWidth = 200; // Adjust as needed

  const navigate = useNavigate();
  const location = useLocation();

  const handleRefreshClick = (targetPath) => (event) => {
    console.log("hello");
    if (location.pathname === targetPath) {
      event.preventDefault(); 
      window.location.href = targetPath;
    }
    
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(to bottom, #FFBA51, #FF4D34)",

          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem>
            <Typography variant="h5" sx={{ marginBottom: 4 }}>
              MediFlow⚕️
            </Typography>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/main/schedule">
              <ListItemText primary="Schedule" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/main/inventory" onClick={handleRefreshClick("/main/inventory")}>
              <ListItemText primary="Inventory" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/main/staff">
              <ListItemText primary="Staff" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/main/rooms">
              <ListItemText primary="Rooms" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
             <ListItemButton component={Link} to="/main/inbox">
                <ListItemText primary="Inbox" />
              </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: 3,
          pr: 3,
          width: `calc(100vw - ${drawerWidth}px)`,
          height: "calc(100vh)",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Routes>
          <Route path="schedule" element={<Schedule />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="additem" element={<AddItem />} />
          <Route path="request" element={<Request />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="staff" element={<Staff />} />
          <Route path="addstaff" element={<AddStaff />} />
          <Route path="addinventory" element={<AddInventory />} />
          <Route path="addroom" element={<AddRoom />} />
          <Route path="chatscreen" element={<ChatScreen/>}/>
          <Route path="inbox" element={<Inbox />} />
          <Route path="createprocess" element={<CreateProcess />} />
          {/* Other routes */}
        </Routes>
      </Box>


      {/* Profile Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: drawerWidth,
          background: "linear-gradient(to bottom, #FFBA51, #FF4D34)",
          p: 1,
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        ></IconButton>
        <Typography
          variant="h4"
          noWrap
          component="div"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          Dr. Jane Doe
        </Typography>
        <Avatar
          alt="Remy Sharp"
          src="https://mui.com/static/images/avatar/1.jpg"
        />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", md: "flex" }, mb: 2 }}
        >
          Upcoming Patients
        </Typography>
        {upcomingPatients.map((patient, index) => (
          <Box key={index} sx={{ width: "100%", textAlign: "center", mb: 1 }}>
            <Typography variant="body1">{patient.name}</Typography>
            <Typography variant="body2">{`Time until turn: ${patient.timeUntilTurn}`}</Typography>
            <Typography variant="body2">{`Stage: ${patient.stage}`}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}