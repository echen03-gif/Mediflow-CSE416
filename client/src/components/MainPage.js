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

export default function MainPage() {
  const drawerWidth = 200; // Adjust as needed

  return (
    <Box sx={{ display: 'flex' }}>
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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Routes>
            <Route path="schedule" element={<Schedule />} />
            {/*<Route path="inventory" element={<Inventory />} />
            <Route path="staff" element={<Staff />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="inbox" element={<Inbox />} />*/}
            </Routes>
        </Box>

        {/* Profile Bar */}
        <Box>
            <Toolbar />
            
        </Box>
    </Box>
  );
}