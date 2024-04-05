/*

    Must be manually run with node initTest.js

    Testing Data: Sample Admin, User, Processes, Procedures, Rooms and Equipment

    Consider clearing DB before pushing to main to include init.js (actual data) -> Mongo DB Atlas Console and Delete Mediflow DB

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

// Test Functions

function createUser(adminBool, email, name, password, role, staffID, status){

    let testUser = {
        admin: adminBool,
        email: email,
        joined: new Date(),
        name: name,
        password: password,
        processes: [],
        role: role,
        staffID: staffID,
        status: status
    }

    let addUser = new Users(testUser)

    return addUser.save();

}

function createEquipmentHead(name, quantity, type, location){

    let testEquipmentHead = {
        name: name,
        quantity: quantity,
        equipment: [],
        type: type,
        location: location,
    }

    let addEquipmentHead = new EquipmentHeads(testEquipmentHead);

    return addEquipmentHead.save();

}

function createRoom(name, roomID, status, type){

    let testRoom = {
        created: new Date(),
        equipment: [],
        name: name, 
        roomID: roomID,
        status: status,
        type: type,
        updatedAt: new Date()

    }

    let addRoom = new Rooms(testRoom);

    return addRoom.save();

}


// Populate

const populate = async () => {
    
    let testAdmin = await createUser(true, "testadmin@gmail.com", "testAdmin", "testAdmin", "admin", 0, "NOT AVAILABLE");
    let testDoctor = await createUser(false, "testDoctor@gmail.com", "testDoctor", "testDoctor", "doctor", 0, "ON CALL");
    let testDoctor2 = await createUser(false, "testDoctor2@gmail.com", "testDoctor2", "testDoctor2", "doctor", 0, "ON DUTY");

    let testRoom = await createRoom("Test Room", 0, "Open", "Radiology");
    let testEquipment = await createEquipmentHead("CT Machine", 2, "Radiology", testRoom);
    

    if (db) db.close();
    console.log('Test Data Inserted Into Mediflow MongoDB');

}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });
