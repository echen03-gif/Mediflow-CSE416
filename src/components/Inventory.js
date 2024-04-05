import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, TablePagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

    // const [tests, setTests] = useState([]);
    // const navigate = useNavigate();

    // const handleAddItem = () => {
    //     navigate('/main/additem');
    // };

    // useEffect(() => {
    //     async function fetchTestData() {
    //         const retrieveTestData = httpsCallable(functions, 'retrieveTestData');

    //         try {
    //             const result = await retrieveTestData();
    //             console.log(result.data);
    //             setTests(result.data);
    //         } catch (error) {
    //             console.error("Error fetching test data:", error);
    //         }
    //     }

    //     fetchTestData();
    // }, []);

    const inventory = [
        { name: 'CT Machine', location: 'Building A', quantity: '1', category: 'Radiology' },
        { name: 'X-Ray Machine ', location: 'Building B', quantity: '2', category: 'Cardiology' },       
        
      ];
      
      
      function isProductAvailable(productName, date) {
        // For now, let's assume all rooms are available on even-numbered days.
        return date.getDate() % 2 === 0;
      }
      
      function Inventory() {
          const [page, setPage] = useState(0);
          const [rowsPerPage, setRowsPerPage] = useState(10);
          const [selectedDate, setSelectedDate] = useState(new Date());
      
          const handleChangePage = (event, newPage) => {
              setPage(newPage);
          };
      
          const handleChangeRowsPerPage = (event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
          };
      
          const handleDateChange = (event) => {
            setSelectedDate(new Date(event.target.value));
          };
      
          return (
              <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                  Inventory
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <TextField
                    label="Search"
                    variant="outlined"
                  />
                  <FormControl variant="outlined">
                    <TextField
                        id="date"
                        label="Date"
                        type="date"
                        defaultValue={selectedDate.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                  </FormControl>
                </Box>
                <TableContainer component={Paper} sx={{ height: 500 }}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell> {/* Added this line */}
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Location</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Category</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                        <TableRow key={product.name}>
                          <TableCell component="th" scope="row" style={{ padding: '10px', paddingRight: '0'}}>
                            <div style={{ width: '15px', height: '30px', backgroundColor: isProductAvailable(product.name, selectedDate) ? 'green' : 'red', marginRight: '10px' }}></div> 
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="center">{product.location}</TableCell>
                          <TableCell align="center">{product.quantity}</TableCell>
                          <TableCell align="center">{product.category}</TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                    <TablePagination
                      rowsPerPageOptions={[10]}
                      component="div"
                      count={inventory.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                </TableContainer>
              </Box>
            );
          }
        
export default Inventory;
