import { React, useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';


import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  Button,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EventNoteIcon from "@mui/icons-material/EventNote"; // for Schedule
import Inventory2Icon from "@mui/icons-material/Inventory2"; // for Inventory
import PeopleIcon from "@mui/icons-material/People"; // for Staff
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"; // for Rooms
import MailOutlineIcon from "@mui/icons-material/MailOutline"; // for Inbox
import LogoutIcon from '@mui/icons-material/Logout';
import Schedule from "./mainPage/Schedule";
import Inventory from "./mainPage/Inventory";
import AddItem from "./mainPage/AddItem";
import Request from "./mainPage/RequestAppointment";
import Rooms from "./mainPage/Rooms";
import Staff from "./mainPage/Staff";
import Inbox from "./mainPage/Inbox";
import Profile from "./mainPage/Profile";
import ChatScreen from "./mainPage/ChatScreen";
import AddStaff from "./mainPage/AddStaff";
import AddInventory from "./mainPage/AddInventory";
import AddRoom from "./mainPage/AddRoom";
import CreateProcess from "./mainPage/CreateProcess";
import PendingAppointment from "./mainPage/AdminAppointmentView";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeSocket, disconnectSocket, getSocket } from './socket';


// Mock array of upcoming patients
// const upcomingPatients = [
//   { name: "Patient 1", timeUntilTurn: "15 mins", stage: "Waiting" },
//   { name: "Patient 2", timeUntilTurn: "30 mins", stage: "Check-in" },
//   { name: "Patient 3", timeUntilTurn: "45 mins", stage: "Screening" },
// ];

export default function MainPage() {
  const [drawerWidth, setDrawerWidth] = useState(200);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // initially true if you want it open by default
  const navigate = useNavigate();
  const location = useLocation();
  //const [isAdmin, setIsAdmin] = useState(false); 
 // const [cookies, , removeCookies] = useCookies(['user']);

 const activeRouteStyle = {
  backgroundColor: "#FF8C00",
  "&:hover": {
    backgroundColor: "#FFA500",
  },
};


  useEffect(() => {
    const checkSession = async () => {
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
      const storedName = sessionStorage.getItem('name');



      if (!storedToken || !storedUser) {
        // If token or username is not found in sessionStorage, redirect to the login page
        navigate('/login');
      }
      else{      
        initializeSocket(storedUser, storedName);
      }


    };

    checkSession(); // Check session when component mounts

    const socket = getSocket();

    if (socket) {
      socket.on('notification', (data) => {
        console.log(data.sender);
        console.log(data.text);
        const toastId = toast(`${data.sender} sent you a message: ${data.text}`, {
          onClick: () => {
            socket.emit('joinRoom', data.roomID);
            navigate(`/main/chatscreen/${data.roomID}`);
            toast.dismiss(toastId);
          },
          position: "bottom-right",
          autoClose: 10000,
          style: {
            backgroundColor: "#4caf50",
            color: "white"
          },
          progressStyle: {
            background: "#ffffff",
            height: '5px'
          }
        });
      });

      socket.on("apptnotification", (data) => {
        console.log('Appointment notification:', data);
        toast(data, {
          position: "bottom-right",
          autoClose: 10000,
          style: {
            backgroundColor: "#4caf50",
            color: "white"
          },
          progressStyle: {
            background: "#ffffff",
            height: '5px'
          }
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
        socket.off("apptnotification");
      }
    };
  }, [navigate]);
 

  const handleRefreshClick = (targetPath) => (event) => {
    console.log("redirecting" + targetPath + location.pathname)
    if(location.pathname.indexOf("chatscreen") >= 0){
      const socket = getSocket()
      const roomId = location.pathname.substring(location.pathname.lastIndexOf("/")+1);
      console.log("you have left the chat screen of room id " + roomId);
      socket.emit("leaveRoom", roomId);
    }
    
    if (location.pathname === targetPath) {
      event.preventDefault();
      window.location.href = targetPath;
    }
  };

  const handleLogout = () => {

    sessionStorage.clear();
    disconnectSocket();
    navigate("/login");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerWidth(isDrawerOpen ? 65 : 200);
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
      <ToastContainer />

      <Drawer
        variant="permanent"
        open={isDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden", // Prevents horizontal scrollbar
            background: "linear-gradient(to bottom, #FFBA51, #FF4D34)",
          },
        }}
      >
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <ListItem>
          <Box sx={{
              marginBottom: 4, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', // Ensures content is centered
              width: '100%' // Ensures the box takes full width of its parent
            }}>
            {isDrawerOpen && (
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                MediFlow
              </Typography>
            )}
            <img
              src="/mediflowlogo.png" // Path to your logo image
              alt="MediFlow Logo"
              style={{ 
                height: '6vh', 
                marginRight: isDrawerOpen ? '1vw' : '0', // Adjust margin when text is shown
                transition: 'margin-right 0.3s' // Smooth transition for margin change
              }}
            />

          </Box>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/schedule"
              onClick={handleRefreshClick("/main/schedule")}
              sx={
                location.pathname === "/main/schedule" ? activeRouteStyle : {}
              }
            >
              <EventNoteIcon />
              {isDrawerOpen && (
                <ListItemText primary=" Schedule" sx={{ fontWeight: "bold" }} />
              )}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/inventory"
              onClick={handleRefreshClick("/main/inventory")}
              sx={
                location.pathname === "/main/inventory" ? activeRouteStyle : {}
              }
            >
              <Inventory2Icon />
              {isDrawerOpen && <ListItemText primary=" Inventory" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/staff"
              onClick={handleRefreshClick("/main/staff")}
              sx={location.pathname === "/main/staff" ? activeRouteStyle : {}}
            >
              <PeopleIcon />
              {isDrawerOpen && <ListItemText primary=" Staff" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/rooms"
              onClick={handleRefreshClick("/main/rooms")}
              sx={location.pathname === "/main/rooms" ? activeRouteStyle : {}}
            >
              <MeetingRoomIcon />
              {isDrawerOpen && <ListItemText primary=" Rooms" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/inbox"
              onClick={handleRefreshClick("/main/inbox")}
              sx={location.pathname === "/main/inbox" ? activeRouteStyle : {}}
            >
              <MailOutlineIcon />
              {isDrawerOpen && <ListItemText primary=" Inbox" />}
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "center",
              width: isDrawerOpen ? "200px" : "50px",
              padding: isDrawerOpen ? "16px 5px" : "0px",
            }}
          >
            <Button
              startIcon={<LogoutIcon />}
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              {isDrawerOpen && "Logout"}
            </Button>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: 3,
          pr: 3,
          width: `calc(100vw - ${drawerWidth}px)`,
          mt: "64px",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Routes>
          <Route path="schedule" element={<Schedule />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="additem" element={<AddItem />} />
          <Route path="request" element={<Request />} />
          <Route path="pending" element={<PendingAppointment />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="staff" element={<Staff />} />
          <Route path="addstaff" element={<AddStaff />} />
          <Route path="addinventory" element={<AddInventory />} />
          <Route path="addroom" element={<AddRoom />} />
          <Route path="chatscreen/:roomID" element={<ChatScreen />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="createprocess" element={<CreateProcess />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </Box>

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(to bottom, #FFbF5F, #FF8C42)", // Adjusted gradient to blend better with sidebar
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* User profile picture and name on the right */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            {/* Content in the center */}
            {/* <Typography variant="h6" component="div">
              Content Here
            </Typography> */}
          </Box>

          <Typography variant="h6" component="div">
            {`${sessionStorage.getItem('name')}`}
          </Typography>
          <Avatar
            src={`https://mediflow-cse416.onrender.com/uploads/${sessionStorage.getItem('pfp')}`}
            component={Link}
            to="/main/profile"
            onClick={handleRefreshClick("/main/profile")}
            sx={location.pathname === "/main/profile" ? activeRouteStyle : {}}
          />

        </Toolbar>
      </AppBar>
    </Box>
  );
}