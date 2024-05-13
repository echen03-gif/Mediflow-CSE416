import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TablePagination, ButtonBase } from '@mui/material';
import { getSocket } from '../socket';
//import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';



// Import statements

function Inbox() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [peopleList, setPeople] = useState([]);
  const [inboxType, setInboxType] = useState('general');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      const currentUserId = sessionStorage.getItem('user');

      setUserId(currentUserId);

      if (inboxType === 'general') {
        try {
          const res = await axios.get('https://mediflow-cse416.onrender.com/users', {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          });
          const filteredPeople = res.data.filter(person => person._id !== currentUserId);

          setPeople(filteredPeople);
          
        } catch (error) {
          console.error('Error fetching general inbox data:', error);
        }
      } else if (inboxType === 'process') {
        try {
          setPeople([]);
        } catch (error) {
          console.error('Error fetching process inbox data:', error);
        }
      }
    };

    fetchData();
  }, [inboxType]);

  // useEffect(() => {


  //   socket.on('userOffline', ({ recipientId }) => {
  //     console.log("user offline");
  //     toast.error(`User ${recipientId} is currently offline.`);
  //   });

  //   return () => {
  //     socket.off('userOffline');

  //   };
  // });

  const handleTabChange = (type) => {
    setInboxType(type);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (personId) => {
    if (inboxType === 'general') {
      //navigate to specific chatroom id based on Ids concatenated together alphabetically idk if this works but if it does im a genius
      const roomId = [personId, userId].sort().join("-");
      console.log("Joining a room with room id " + roomId);
      const socket = getSocket()
      socket.emit('joinRoom', roomId);
      navigate(`/main/chatscreen/${roomId}`);

    } else if (inboxType === 'process') {

    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Chat Inbox
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <ButtonBase onClick={() => handleTabChange('general')} sx={{ fontWeight: inboxType === 'general' ? 'bold' : 'normal' }} data-testid="general-inbox-tab">
          <Typography variant="button">General Inbox</Typography>
        </ButtonBase>
        <ButtonBase onClick={() => handleTabChange('process')} sx={{ fontWeight: inboxType === 'process' ? 'bold' : 'normal' }} data-testid="process-inbox-tab">
          <Typography variant="button">Process Inbox</Typography>
        </ButtonBase>
      </Box>
      <TableContainer component={Paper} sx={{ height: 500 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Last Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {peopleList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((person) => (
              <TableRow key={person._id} style={{ userSelect: 'none' }} data-testid="user-row">
                <ButtonBase
                  onClick={() => handleRowClick(person._id)}
                  style={{ display: 'contents' }} 
                  disableRipple
                >
                  <TableCell>
                    <img src={`https://mediflow-cse416.onrender.com/uploads/${person.profilePic.split('/').pop()}`} alt={person.name} style={{ width: 50, borderRadius: '50%' }} />
                  </TableCell>
                  <TableCell>{person.name}</TableCell>
                  <TableCell align="right">N/A</TableCell>
                </ButtonBase>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={peopleList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}

export default Inbox;


