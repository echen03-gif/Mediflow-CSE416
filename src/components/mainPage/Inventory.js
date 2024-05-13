import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	TextField,
	Box,
	TablePagination,
	FormControl,
	Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Inventory() {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [inventoryPage, setInventoryPage] = useState("default");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [appointmentList, setAppointmentList] = useState([]);
	const [appointmentIds, setAppointmentIds] = useState([]);
	const [inventoryHeadList, setInventoryHead] = useState([]);
	const [usersList, setUsersList] = useState([]);
	const [equipmentList, setEquipmentList] = useState([]);
	const [equipmentDB, setEquipmentDB] = useState([]);
	const [roomList, setRooms] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);

	// DB API

	const api = axios.create({
		baseURL: "https://mediflow-cse416.onrender.com",
	});

	// Add an interceptor to add Authorization header to each request
	api.interceptors.request.use(
		(config) => {
			const token = sessionStorage.getItem("token");
			if (token) {
				config.headers["Authorization"] = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// use api.get instead of axios.get
	useEffect(() => {
		const fetchData = async () => {
		  try {
			let userId = sessionStorage.getItem('user');
		
			// Fetch users list
			const usersResponse = await api.get("/users");
			setUsersList(usersResponse.data);
		
			const inventoryHeadResponse = await api.get("/equipmentHead");
			setInventoryHead(inventoryHeadResponse.data);
		
			const roomsResponse = await api.get("/rooms");
			setRooms(roomsResponse.data);
		
			const equipmentResponse = await api.get("/equipment");
			setEquipmentDB(equipmentResponse.data);
		
			const appointmentsResponse = await api.get("/appointments");
			setAppointmentList(appointmentsResponse.data);
		
			const userResponse = await api.get(`/userID/${userId}`);
			setIsAdmin(userResponse.data.role === 'admin');
		  } catch (error) {
			console.error('Error fetching data:', error);
		  }
		};
	  
		fetchData();
	  }, []);
	  

	// Functions

	const switchInventoryPage = (equipment) => {
		if (
			inventoryHeadList.find(
				(equipmentHead) => equipmentHead.name === equipment
			).equipment.length === 0
		) {
		} else {
			setEquipmentList(
				inventoryHeadList.find(
					(equipmentHead) => equipmentHead.name === equipment
				).equipment
			);
			setInventoryPage("equipmentViewing");
		}
	};

	const viewSpecificAppointments = (equipment) => {
		if (equipment.appointments.length === 0) {
		} else {
			setAppointmentIds(equipment.appointments);

			setInventoryPage("appointmentViewing");
		}
	};


	function isProductAvailable(productName, date) {
		
		
		const equipment = equipmentDB.find(equipment => equipment._id === productName);

		const currentDate = new Date(date);
		
		const isAvailable = equipment.appointments.some(appointment => {

			let appointmentData = appointmentList.find(appointmentId => appointmentId._id === appointment);
			
			return appointmentData.procedures.some(procedure => {
				const start = new Date(procedure.scheduledStartTime);
				const end = new Date(procedure.scheduledEndTime);

				
				return currentDate >= start && currentDate <= end;
			});
		});
		
	
		return !isAvailable;
	}
	

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

	// Display

	switch (inventoryPage) {
		case "appointmentViewing":
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
						<TextField label="Search" variant="outlined" data-testid="search-input" />
						<FormControl variant="outlined">
							<TextField
								id="date"
								label="Date"
								type="date"
								defaultValue={
									selectedDate.toISOString().split("T")[0]
								}
								onChange={handleDateChange}
								InputLabelProps={{
									shrink: true,
								}}
								inputProps={{ 'data-testid': 'date-input' }}
							/>
						</FormControl>
					</Box>
					{isAdmin &&
						<Button
						variant="contained"
						color="primary"
						onClick={navigateToAddInventory}
						data-testid="add-inventory-button"
					>
						Add Inventory
					</Button>
					}
					
					<TableContainer component={Paper} sx={{ height: 500 }}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>{" "}
									{/* Added this line */}
									<TableCell>Appointment</TableCell>
									<TableCell align="center">
										Scheduled Dates
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{appointmentIds.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											style={{ textAlign: "center" }}
										>
											Loading...
										</TableCell>
									</TableRow>
								) : (
									appointmentIds
										.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
										)
										.map((product) => (
											<TableRow key={product} data-testid={`appointment-row-${product}`}>
												<TableCell
													component="th"
													scope="row"
													style={{
														padding: "10px",
														paddingRight: "0",
													}}
												>
												</TableCell>
												<TableCell>
													{
														usersList.find(userId => userId._id === appointmentList.find(
															(appointment) =>
																appointment._id ===
																product
														).patient).name
													}
												</TableCell>
												<TableCell align="center">
													{
														appointmentList.find(
															(appointment) => appointment._id === product
														).procedures.map(procedure => {
															const date = new Date(procedure.scheduledStartTime);
															const endDate = new Date(procedure.scheduledEndTime);
															return `${date.getMonth() + 1}/${date.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
														}).join(", ")

													}
												</TableCell>
											</TableRow>
										))
								)}
							</TableBody>
						</Table>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								padding: 2,
							}}
						>
							<TablePagination
								rowsPerPageOptions={[10]}
								component="div"
								count={inventoryHeadList.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								data-testid="pagination"
							/>
						</Box>
					</TableContainer>
				</Box>
			);

		case "equipmentViewing":
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
						<TextField label="Search" variant="outlined" data-testid="search-input" />
						<FormControl variant="outlined">
							<TextField
								id="date"
								label="Date"
								type="date"
								defaultValue={
									selectedDate.toISOString().split("T")[0]
								}
								onChange={handleDateChange}
								InputLabelProps={{
									shrink: true,
								}}
								inputProps={{ 'data-testid': 'date-input' }}
							/>
						</FormControl>
					</Box>
					
					{
						isAdmin && 
						<Button
						variant="contained"
						color="primary"
						onClick={navigateToAddInventory}
						data-testid="add-inventory-button"
					>
						Add Inventory
					</Button>
					}
					
					<TableContainer component={Paper} sx={{ height: 500 }}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>{" "}
									{/* Added this line */}
									<TableCell>ID</TableCell>
									<TableCell align="center">
										Location
									</TableCell>
									<TableCell align="center">Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{equipmentList.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											style={{ textAlign: "center" }}
										>
											Loading...
										</TableCell>
									</TableRow>
								) : (
									equipmentList
										.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
										)
										.map((product) => (
											<TableRow key={product} data-testid={`equipment-row-${product}`}>
												<TableCell
													component="th"
													scope="row"
													style={{
														padding: "10px",
														paddingRight: "0",
													}}
												>
													<div
														style={{
															width: "15px",
															height: "30px",
															backgroundColor:
																isProductAvailable(
																	product,
																	selectedDate
																)
																	? "green"
																	: "red",
															marginRight: "10px",
														}}
													></div>
												</TableCell>
												<TableCell>
													<Typography
														onClick={(e) => {
															e.preventDefault();
															viewSpecificAppointments(
																equipmentDB.find(
																	(
																		equipment
																	) =>
																		equipment._id ===
																		product
																)
															);
														}}
														style={{
															cursor: "pointer",
															textDecoration:
																"none",
														}}
														onMouseEnter={(e) => {
															e.target.style.textDecoration =
																"underline";
														}}
														onMouseLeave={(e) => {
															e.target.style.textDecoration =
																"none";
														}}
														data-testid={`equipment-name-${product}`}
													>
														{
															equipmentDB.find(
																(equipment) =>
																	equipment._id ===
																	product
															).name
														}
													</Typography>
												</TableCell>
												<TableCell align="center">
													{
														roomList.find(
															(room) =>
																room._id ===
																equipmentDB.find(
																	(
																		equipment
																	) =>
																		equipment._id ===
																		product
																).location
														).name
													}
												</TableCell>
												<TableCell align="center">
													{
														equipmentDB.find(
															(equipment) =>
																equipment._id ===
																product
														).status
													}
												</TableCell>
											</TableRow>
										))
								)}
							</TableBody>
						</Table>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								padding: 2,
							}}
						>
							<TablePagination
								rowsPerPageOptions={[10]}
								component="div"
								count={inventoryHeadList.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								data-testid="pagination"
							/>
						</Box>
					</TableContainer>
				</Box>
			);

		case "default":
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
						<TextField label="Search" variant="outlined" data-testid="search-input" />
						<FormControl variant="outlined">
							<TextField
								id="date"
								label="Date"
								type="date"
								defaultValue={
									selectedDate.toISOString().split("T")[0]
								}
								onChange={handleDateChange}
								InputLabelProps={{
									shrink: true,
								}}
								inputProps={{ 'data-testid': 'date-input' }}
							/>
						</FormControl>
					</Box>
					{
						isAdmin &&
						<Button
						variant="contained"
						color="primary"
						onClick={navigateToAddInventory}
						data-testid="add-inventory-button"
					>
						Add Inventory
					</Button>
					}
					
					<TableContainer component={Paper} sx={{ height: 500 }}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>{" "}
									{/* Added this line */}
									<TableCell>Product</TableCell>
									<TableCell align="center">
										Quantity
									</TableCell>
									<TableCell align="center">
										Category
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{inventoryHeadList
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((product) => (
										<TableRow key={product.name} data-testid={`inventory-row-${product.name}`}>
											<TableCell
												component="th"
												scope="row"
												style={{
													padding: "10px",
													paddingRight: "0",
												}}
											>

											</TableCell>
											<TableCell>
												<Typography
													onClick={(e) => {
														e.preventDefault();
														switchInventoryPage(
															product.name
														);
													}}
													style={{
														cursor: "pointer",
														textDecoration: "none",
													}}
													onMouseEnter={(e) => {
														e.target.style.textDecoration =
															"underline";
													}}
													onMouseLeave={(e) => {
														e.target.style.textDecoration =
															"none";
													}}
													data-testid={`product-name-${product.name}`}
												>
													{product.name}
												</Typography>
											</TableCell>
											<TableCell align="center">
												{product.quantity}
											</TableCell>
											<TableCell align="center">
												{product.type}
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								padding: 2,
							}}
						>
							<TablePagination
								rowsPerPageOptions={[10]}
								component="div"
								count={inventoryHeadList.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								data-testid="pagination"
							/>
						</Box>
					</TableContainer>
				</Box>
			);

		default:
			return;
	}
}

export default Inventory;
