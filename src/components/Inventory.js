import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, TablePagination, FormControl, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function isProductAvailable(productName, date) {
  // For now, let's assume all rooms are available on even-numbered days.
  return date.getDate() % 2 === 0;
}

function Inventory() {
  const [page, setPage] = useState(0);
  const [inventoryPage, setInventoryPage] = useState('default');
  const [viewingEquipment, setViewingEquipment] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [inventoryHeadList, setInventoryHead] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentDB, setEquipmentDB] = useState([]);
  const [roomList, setRooms] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {

    axios.get('https://mediflow-cse416.onrender.com/equipmentHead').then(res => { setInventoryHead(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/rooms').then(res => { setRooms(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/equipment').then(res => { setEquipmentDB(res.data) });

  }, []);



  const switchInventoryPage = (equipment) => {


    setViewingEquipment(equipment);

    setInventoryPage('equipmentViewing');

    setEquipmentList(inventoryHeadList.find((equipmentHead) => equipmentHead.name === equipment).equipment);

    console.log(inventoryHeadList.find((equipmentHead) => equipmentHead.name === equipment).equipment);

  };



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

  const navigateToAddInventory = () => {
    navigate("/main/addinventory");
  };

  switch (inventoryPage) {

    case 'equipmentViewing':
      return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Inventory
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <TextField label="Search" variant="outlined" />
            <FormControl variant="outlined">
              <TextField
                id="date"
                label="Date"
                type="date"
                defaultValue={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={navigateToAddInventory}
          >
            Add Inventory
          </Button>
          <TableContainer component={Paper} sx={{ height: 500 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell> {/* Added this line */}
                  <TableCell>ID</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipmentList.length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : equipmentList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ padding: "10px", paddingRight: "0" }}
                      >
                        <div
                          style={{
                            width: "15px",
                            height: "30px",
                            backgroundColor: isProductAvailable(
                              product.name,
                              selectedDate
                            )
                              ? "green"
                              : "red",
                            marginRight: "10px",
                          }}
                        ></div>
                      </TableCell>
                      <TableCell> 
                        {equipmentDB.find(equipment => equipment._id === product).name}
                      </TableCell>
                      <TableCell align="center">{roomList.find(room => room._id == (equipmentDB.find(equipment => equipment._id === product).location)).name}</TableCell>
                      <TableCell align="center">{equipmentDB.find(equipment => equipment._id === product).status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <TablePagination
              rowsPerPageOptions={[10]}
              component="div"
              count={inventoryHeadList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </TableContainer>
        </Box>
      )

    case 'default':
      return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Inventory
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <TextField label="Search" variant="outlined" />
            <FormControl variant="outlined">
              <TextField
                id="date"
                label="Date"
                type="date"
                defaultValue={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={navigateToAddInventory}
          >
            Add Inventory
          </Button>
          <TableContainer component={Paper} sx={{ height: 500 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell> {/* Added this line */}
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryHeadList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.name}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ padding: "10px", paddingRight: "0" }}
                      >
                        <div
                          style={{
                            width: "15px",
                            height: "30px",
                            backgroundColor: isProductAvailable(
                              product.name,
                              selectedDate
                            )
                              ? "green"
                              : "red",
                            marginRight: "10px",
                          }}
                        ></div>
                      </TableCell>
                      <TableCell><Typography onClick={(e) => { e.preventDefault(); switchInventoryPage(product.name); }} style={{ cursor: 'pointer', textDecoration: 'none' }} onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }} >
                        {product.name}
                      </Typography>
                      </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="center">{product.type}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={inventoryHeadList.length}
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

}

export default Inventory;
