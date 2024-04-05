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
  Typography,
  Avatar,
  IconButton,
  Badge
} from '@mui/material';
import Schedule from "./Schedule";
import Inventory from "./Inventory";
import AddItem from "./AddItem";
import Request from "./RequestAppointment";

const doctorMessages = [
  { name: "Doctor 1", message: "asdfjnasdf;js" },
  { name: "Doctor 2", message: "asdfjasdfsd" },
  { name: "Doctor 3", message: "askdjlfasdf" },
  { name: "Doctor 4", message: "askdfjasdfklj" },
  { name: "Doctor 5", message: "asdfasdf" },
];

export default function MainPage() {
  const drawerWidth = 200; // Adjust as needed

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#FF8141' },
            }}
        >
            <Toolbar />
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
        <Box 
            component="main" 
            sx={{ 
                flexGrow: 1, 
                p: 3, 
                width: `calc(100vw - ${drawerWidth}px)`, 
                height: 'calc(100vh)', 
                overflow: 'hidden',
                backgroundColor: 'white'
            }}
            >
            <Routes>
              <Route path="schedule" element={<Schedule />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="additem" element={<AddItem />} />
              <Route path="request" element={<Request />} />
              {/* Other routes */}
            </Routes>
        </Box>

        {/* Profile Bar */}
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            alignItems: 'center', 
            width: drawerWidth, 
            bgcolor: '#FF8141', 
            p: 1
        }}>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
        >
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', md: 'flex' } }}>
            Dr. Jane Doe
        </Typography>
        <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
        {/* displaying inbox */}
        <Box sx={{ maxHeight: 200, overflowY: 'auto', width: '100%', mt: 2 }}>
            {doctorMessages.map((message, index) => (
            <Typography key={index} variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {message.name}: {message.message}
            </Typography>
            ))}
        </Box>
        </Box>
    </Box>
  );
}
