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

function createUser(adminBool, email, name, age, gender, password, role, staffID, schedule){

    let createUser = {
        admin: adminBool,
        email: email,
        joined: new Date(),
        name: name,
        age: age,
        gender: gender,
        password: password,
        processes: [],
        role: role,
        staffID: staffID,
        schedule: schedule,
    }

    let addUser = new Users(createUser)

    return addUser.save();

}

function createEquipmentHead(name, quantity, type, equipment){

    let createEquipmentHead = {
        name: name,
        quantity: quantity,
        equipment: [equipment],
        type: type,
    }

    let addEquipmentHead = new EquipmentHeads(createEquipmentHead);

    return addEquipmentHead.save();

}

function createEquipment(name, locationRoom, type){

    let createEquipment = {
        location: locationRoom,
        name: name,
        status: "Functional",
        type: type
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

function createProcedure(description, estimatedDuration, name, procedureID, requiredEquipment, requiredRoomType, locationRoom, staffType){

    let createProcedure = {

        created: new Date(),
        description: description,
        estimatedDuration: estimatedDuration,
        name: name,
        procedureID: procedureID,
        requiredEquipment: requiredEquipment,
        requiredRoomType: requiredRoomType,
        location: locationRoom,
        staffType: staffType

    }

    let addProcedure = new Procedures(createProcedure);

    return addProcedure.save();
}


function createProcess(name, procedures){

    let createProcess = {

        name: name,
        components: procedures
        

    }

    let addProcess = new Processes(createProcess);

    return addProcess.save();
}


// Populate
const admin_password = "sysAdmin"
const saltRounds = 10;
const hashedPass = bcrypt.hashSync(admin_password, saltRounds);

const populate = async () => {

    let sysAdmin = await createUser(true, "sysAdmin@gmail.com", "SYSTEM ADMIN", 28, "Male", hashedPass, "admin", 0,
     {
        Monday: [{start: "09:00", end: "17:00"}],
        Tuesday: [{start: "09:00", end: "17:00"}],
        Wednesday: [{start: "20:00", end: "24:00"}],
        Thursday: [{start: "06:00", end: "19:00"}],
        Friday: [{start: "03:00", end: "20:00"}],
        Saturday: [{start: "15:00", end: "18:00"}],
        Sunday: [{start: "04:00", end: "15:00"}]
    });

    // ROOMS

    let storageRoom = await createRoom("Storage Room", 0, "OPEN", "Storage");
    let heartRoom = await createRoom("Room 101", 1, "OPEN", "Cardiology");
    let icu = await createRoom("Room 102", 2, "OPEN", "ICU");

    // EQUIPMENT

    let heartLungMachineOne = await createEquipment("Heart-Lung Machine One", storageRoom, "Cardiology");
    let heartLungMachineHead = await createEquipmentHead("Heart Lung Machine", 1, "Cardiology", heartLungMachineOne);

    // PROCEDURES

    let heartSurgeryPreOp = await createProcedure("Patient needs to complete chest x-ray, blood tests, and fasting diet requirements.", 1000, "Heart Surgery PreOP", 0, [], null, null, "Nurse");
    let heartSurgeryOp = await createProcedure("Patient needs to undergo anesthesia in which the performing doctor will execute the surgery", 2000, "Heart Surgery OP", 1, "Cardiology", heartRoom, "Doctor");
    let heartSurgeryPostOp = await createProcedure("Patient needs to rest and be monitored", 1000, "Heart Surgery PostOP", 2, [], "ICU", icu, "Nurse");

    // PROCESSES

    let heartSurgery = await createProcess("Heart Surgery",[heartSurgeryPreOp, heartSurgeryOp, heartSurgeryPostOp]);

    
    if (db) db.close();
    console.log('Preset Data Inserted into DB');

}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });
