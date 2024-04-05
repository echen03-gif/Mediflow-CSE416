import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import Schedule from "./Schedule";
//import Schedule from './Schedule copy';
import Inventory from "./Inventory";
import AddItem from "./AddItem";
import Request from "./RequestAppointment";
import Rooms from "./Rooms";

export default function MainPage() {
  const drawerWidth = 200; // Adjust as needed

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar /> {/* Provides offset for the content below the app bar */}
            <List>
                <ListItem>
                    <Typography variant="h5" sx={{ marginBottom: 4 }}>MediFlow</Typography>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/main/schedule">
                    <ListItemText primary="Schedule" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/main/inventory">
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
                    <ListItemButton component={Link} to="/main/index">
                    <ListItemText primary="Index" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100vw - ${drawerWidth}px)`, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <Routes>
              <Route path="schedule" element={<Schedule />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="additem" element={<AddItem />} />
              <Route path="request" element={<Request />} />
              <Route path="rooms" element={<Rooms />} />
              {/* Other routes */}
            </Routes>
        </Box>

        {/* Profile Bar */}
        <Box>
            <Toolbar />
            
        </Box>
    </Box>
  );
}