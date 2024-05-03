import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, TablePagination, ButtonBase } from '@mui/material';
import { socket } from '../MainPage.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Inbox() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [peopleList, setPeople] = useState([]);
  //const navigate = useNavigate();


  useEffect(() => {


    socket.on('userOffline', ({ recipientId }) => {
      console.log("user offline");
      toast.error(`User ${recipientId} is currently offline.`);
    });

    return () => {
      socket.off('userOffline');

    };
  });

  // DB API

  useEffect(() => {
    axios.get('https://mediflow-cse416.onrender.com/users',
    { 
      headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => {setPeople(res.data) });
  }, []);

  // Functions

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (personId) => {
    socket.emit('chatStart', personId);
  
  };

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Chat Inbox
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
            />
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
                  <TableRow key={person._id} style={{ userSelect: 'none' }}>
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

