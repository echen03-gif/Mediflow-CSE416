/*

    Must be manually run with node init.js

    HardCoded Data -> Admins, Procedures, Processes


*/

const bcrypt = require('bcrypt');

let Users = require('./models/users.js');
let Procedures = require('./models/procedure.js');
let Equipment = require('./models/equipment.js');
let EquipmentHeads = require('./models/equipmentHead.js')
let Rooms = require('./models/room.js');
let Communication = require('./models/communication.js');
let Processes = require('./models/processes.js');


const uri = process.env.MEDIFLOWKEY;
let mongoose = require('mongoose');

mongoose.connect(uri);

let db = mongoose.connection;

// Create Functions

function createUser(adminBool, email, name, password, role, staffID, schedule){

    let createUser = {
        admin: adminBool,
        email: email,
        joined: new Date(),
        name: name,
        password: password,
        processes: [],
        role: role,
        staffID: staffID,
        schedule: schedule,
    }

    let addUser = new Users(createUser)

    return addUser.save();

}

function createEquipmentHead(name, quantity, type){

    let createEquipmentHead = {
        name: name,
        quantity: quantity,
        equipment: [],
        type: type,
    }

    let addEquipmentHead = new EquipmentHeads(createEquipmentHead);

    return addEquipmentHead.save();

}

function createEquipment(name, quantity, type){

    let createEquipment = {
        name: name,
        quantity: quantity,
        equipment: [],
        type: type,
    }

    let addEquipment = new Equipment(createEquipment);

    return addEquipment.save();

}

function createRoom(name, roomID, status, type){

    let createRoom = {
        created: new Date(),
        equipment: [],
        name: name, 
        roomID: roomID,
        status: status,
        type: type,
        updatedAt: new Date()

    }

    let addRoom = new Rooms(createRoom);

    return addRoom.save();

}

function createProcedure(description, estimatedDuration, name, procedureID, requiredEquipment, requiredRoomType, scheduledEndTime, scheduledStartTime){

    let createProcedure = {

        created: newDate(),
        description: description,
        estimatedDuration: estimatedDuration,
        name: name,
        procedureID: procedureID,
        requiredEquipment: requiredEquipment,
        requiredRoomType: requiredRoomType

    }

    let addProcedure = new Procedures(createProcedure);

    return addProcedure.save();
}


function createProcess(procedures, equipment, staff, status, scheduledEndTime, scheduledStartTime){

    let createProcess = {

        components: procedures,
        equipment: equipment,
        staff: staff,
        status: status,
        scheduledEndTime: scheduledEndTime,
        scheduledStartTime: scheduledStartTime

    }

    let addProcess = new Procedures(createProcess);

    return addProcess.save();
}


// Populate
const admin_password = "sysAdmin"
const saltRounds = 10;
const hashedPass = bcrypt.hashSync(admin_password, saltRounds);

const populate = async () => {

    let sysAdmin = await createUser(true, "sysAdmin@gmail.com", "SYSTEM ADMIN", hashedPass, "admin", 0,
     {
        Monday: [{start: "09:00", end: "17:00"}],
        Tuesday: [{start: "09:00", end: "17:00"}],
        Wednesday: [{start: "20:00", end: "24:00"}],
        Thursday: [{start: "06:00", end: "19:00"}],
        Friday: [{start: "03:00", end: "20:00"}],
        Saturday: [{start: "15:00", end: "18:00"}],
        Sunday: [{start: "04:00", end: "15:00"}]
    });

    
    
    if (db) db.close();
    console.log('Preset Data Inserted into DB');

}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });
