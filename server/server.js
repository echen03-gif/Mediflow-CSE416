const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');


app.use(express.json());
app.use(cors());


const port = 8000;
// The below URL is for npm start and local host
// Local Port: http://localhost:8000/

const uri = process.env.MEDIFLOWKEY;
let mongoose = require('mongoose');

mongoose.connect(uri);

let db = mongoose.connection;

let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

db.on('connected', function () {

    console.log("Mongo DB Atlas - Mediflow sucessfully connected");

})

// Define Mediflow Schemas/Collections

let Users = require('./models/users.js');
let Procedures = require('./models/procedure.js');
let Equipment = require('./models/equipment.js');
let EquipmentHeads = require('./models/equipmentHead.js')
let Rooms = require('./models/room.js');
let Communication = require('./models/communication.js');
let Processes = require('./models/processes.js');
const equipment = require('./models/equipment.js');
const equipmentHead = require('./models/equipmentHead.js');

// Define Backend Functions

// GET FUNCTIONS

app.get('/users', async (req, res) => {

    let users = await Users.find();

    res.send(users);

});

app.get('/procedures', async (req, res) => {

    let procedures = await Procedures.find();

    res.send(procedures);

});

app.get('/equipment', async (req, res) => {

    let equipment = await Equipment.find();

    res.send(equipment);

});


app.get('/equipmentHead', async (req, res) => {

    let equipmentHead = await EquipmentHeads.find();

    res.send(equipmentHead);

});

app.get('/rooms', async (req, res) => {

    let rooms = await Rooms.find();

    res.send(rooms);

});

app.get('/communication', async (req, res) => {

    let communication = await Communication.find();

    res.send(communication);

});

app.get('/processes', async (req, res) => {

    let processes = await Processes.find();

    res.send(processes);

});


// POST FUNCTIONS


app.post('/createUser', async (req, res) => {
    
    const newUser = new Users({
        admin: req.body.admin,
        name: req.body.name,
        email: req.body.email,
        joined: new Date(),
        password: req.body.password,
        processes: [],
        role: req.body.role,
        staffID: req.body.staffID,
        status: req.body.status
    })
    
    res.send(await newUser.save());

});

app.post('/createProcedure', async (req, res) => {
    
    const newProcedure = new Procedures({

        created: new Date(),
        description: req.body.description,
        estimatedDuration: req.body.estimatedDuration,
        name: req.body.name,
        procedureID: req.body.procedureID,
        requiredRoomEquipment: req.body.requiredRoomEquipment,
        requiredRoomType: req.body.requiredRoomType,
        scheduledEndTime: req.body.scheduledEndTime,
        scheduledStartTime: req.body.scheduledStartTime

    })
    
    res.send(await newProcedure.save());
    
});

app.post('/createEquipmentHead', async (req, res) => {
    
    const newEquipmentHead = new EquipmentHeads({

        name: req.body.name,
        quantity: 0,
        equipment: [],
        type: req.body.type

    })
    
    res.send(await newEquipmentHead.save());
    
});

app.post('/createEquipment', async (req, res) => {
    
    const newEquipment = new Equipment({
        
        created: new Date(),
        location: req.body.location,
        name: req.body.name,
        status: "Functional",
        type: req.body.type,
        updatedAt: new Date()
    })
    
    res.send(await newEquipment.save());
    
});

app.post('/createRoom', async (req, res) => {
    
    const newRoom = new Rooms({
        
        created: new Date(),
        equipment: [],
        name: req.body.name,
        status: req.body.status,
        type: req.body.type,
        updatedAt: new Date(),
        roomID: req.body.roomID
    })
    
    res.send(await newRoom.save());
    
});

app.post('/createProcess', async (req, res) => {
    
    const newProcess = new Processes({

        completed: req.body.completed,
        components: req.body.components,
        created: new Date(),
        equipment: req.body.equipment,
        staff: req.body.staff,
        status: req.body.status
        
    })
    
    res.send(await newProcess.save());
    
});

// PUT FUNCTIONS

app.put('/changeEquipmentHead', async (req, res) => {

    let equipmentHeadUpdate = await equipmentHead.findOne({name: req.body.name});

    equipmentHeadUpdate.quantity += 1;

    equipmentHeadUpdate.equipment.push(req.body.equipment);

    await equipmentHeadUpdate.save();

    res.send("Equipemnt Head Updated");


});

// DELETE FUNCTIONS


// for supertest
module.exports = {app, server};