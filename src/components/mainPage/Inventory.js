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
import moment from 'moment-timezone';

function Inventory() {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [inventoryPage, setInventoryPage] = useState("default");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [appointmentList, setAppointmentList] = useState([]);
	const [appointmentIds, setAppointmentIds] = useState([]);
	const [inventoryHeadList, setInventoryHead] = useState([]);
	const [procedureList, setProcedureList] = useState([]);
	const [usersList, setUsersList] = useState([]);
	const [equipmentList, setEquipmentList] = useState([]);
	const [equipmentDB, setEquipmentDB] = useState([]);
	const [roomList, setRooms] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [currentEquipment, setCurrentEquipment] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

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

	const cacheData = (key, data) => {
		const cache = {
			data,
			timestamp: new Date().getTime(),
		};
		localStorage.setItem(key, JSON.stringify(cache));
	};

	const getCachedData = (key, expiration = 3600000) => { // default expiration is 1 hour
		const cached = localStorage.getItem(key);
		if (!cached) return null;

		const { data, timestamp } = JSON.parse(cached);
		if (new Date().getTime() - timestamp > expiration) {
			localStorage.removeItem(key);
			return null;
		}
		return data;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				let userId = sessionStorage.getItem('user');

				// Check cache first
				let users = getCachedData("users");
				let inventoryHead = getCachedData("inventoryHead");
				let rooms = getCachedData("rooms");
				let equipment = getCachedData("equipment");
				let appointments = getCachedData("appointments");
				let procedures = getCachedData("procedures");
				let userRole = getCachedData(`userRole_${userId}`);

				if (!users) {
					const usersResponse = await api.get("/users");
					users = usersResponse.data;
					cacheData("users", users);
				}
				setUsersList(users);

				if (!inventoryHead) {
					const inventoryHeadResponse = await api.get("/equipmentHead");
					inventoryHead = inventoryHeadResponse.data;
					cacheData("inventoryHead", inventoryHead);
				}
				setInventoryHead(inventoryHead);

				if (!rooms) {
					const roomsResponse = await api.get("/rooms");
					rooms = roomsResponse.data;
					cacheData("rooms", rooms);
				}
				setRooms(rooms);

				if (!equipment) {
					const equipmentResponse = await api.get("/equipment");
					equipment = equipmentResponse.data;
					cacheData("equipment", equipment);
				}
				setEquipmentDB(equipment);

				if (!appointments) {
					const appointmentsResponse = await api.get("/appointments");
					appointments = appointmentsResponse.data;
					cacheData("appointments", appointments);
				}
				setAppointmentList(appointments);

				if (!procedures) {
					const proceduresResponse = await api.get('/procedures');
					procedures = proceduresResponse.data;
					cacheData("procedures", procedures);
				}
				setProcedureList(procedures);

				if (!userRole) {
					const userResponse = await api.get(`/userID/${userId}`);
					userRole = userResponse.data.role;
					cacheData(`userRole_${userId}`, userRole);
				}
				setIsAdmin(userRole === 'admin');
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

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
			setPage(0);
		}
	};

	const viewSpecificAppointments = (equipment) => {
		if (equipment.appointments.length === 0) {
		} else {
			setAppointmentIds(equipment.appointments);
			setCurrentEquipment(equipment);
			setPage(0);
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

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const filteredInventoryHeadList = inventoryHeadList.filter((item) =>
		item.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredEquipmentList = equipmentList.filter((item) =>
		equipmentDB.find((equipment) => equipment._id === item).name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Display
	switch (inventoryPage) {
		case "appointmentViewing":
			return (
				<Box sx={{ height: '100%', overflow: 'auto' }}>
					<h2>INVENTORY</h2>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: 2,
						}}
					>
						<TextField label="Search" variant="outlined" data-testid="search-input" value={searchQuery} onChange={handleSearchChange} />
						<FormControl variant="outlined">
							<TextField
								id="date"
								label="Date"
								type="datetime-local"
								defaultValue={`${selectedDate.toISOString().split("T")[0]}T${selectedDate.toTimeString().split(" ")[0].substring(0, 5)}`}
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
									<TableCell>Patient</TableCell>
									<TableCell>Procedure</TableCell>
									<TableCell align="center">Scheduled Time</TableCell>
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
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.flatMap((appointmentId) =>
											appointmentList
												.filter((appointment) => appointment._id === appointmentId)
												.flatMap((individualAppointment) =>
													individualAppointment.procedures
														.filter((procedure) => procedure.equipment.includes(currentEquipment._id))
														.map((procedure) => (
															<TableRow key={procedure}>
																<TableCell
																	component="th"
																	scope="row"
																	style={{ padding: "10px", paddingRight: "0" }}
																>
																</TableCell>
																<TableCell>
																	{usersList.find((user) => user._id === individualAppointment.patient).name}
																</TableCell>
																<TableCell>
																	{procedureList.find((procedureName) => procedureName._id === procedure.procedure).name}
																</TableCell>
																<TableCell align="center">
																	{moment(procedure.scheduledStartTime).tz('America/New_York').format('M/D hh:mm A') + " - " + moment(procedure.scheduledEndTime).tz('America/New_York').format('M/D hh:mm A')}
																</TableCell>
															</TableRow>
														))
												)
										)
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
				<Box sx={{ height: '100%', overflow: 'auto' }}>
					<h2>INVENTORY</h2>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: 2,
						}}
					>
						<TextField label="Search" variant="outlined" data-testid="search-input" value={searchQuery} onChange={handleSearchChange} />
						<FormControl variant="outlined">
							<TextField
								id="date"
								label="Date"
								type="datetime-local"
								defaultValue={`${selectedDate.toISOString().split("T")[0]}T${selectedDate.toTimeString().split(" ")[0].substring(0, 5)}`}
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
								
									<TableCell>ID</TableCell>
									<TableCell align="center">
										Location
									</TableCell>
									<TableCell align="center">Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredEquipmentList.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											style={{ textAlign: "center" }}
										>
											Loading...
										</TableCell>
									</TableRow>
								) : (
									filteredEquipmentList
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
				<Box sx={{ height: '100%', overflow: 'auto' }}>
					<h1>Inventory</h1>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: 2,
						}}
					>
						<TextField label="Search" variant="outlined" data-testid="search-input" value={searchQuery} onChange={handleSearchChange} />
						<FormControl variant="outlined">
							<TextField
								id="date"
								label="Date"
								type="datetime-local"
								defaultValue={`${selectedDate.toISOString().split("T")[0]}T${selectedDate.toTimeString().split(" ")[0].substring(0, 5)}`}
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
									
									<TableCell>Equipment</TableCell>
									<TableCell align="center">
										Quantity
									</TableCell>
									<TableCell align="center">
										Category
									</TableCell>
									</TableRow>
							</TableHead>
							<TableBody>
								{filteredInventoryHeadList
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
