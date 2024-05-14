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

function createUser(adminBool, email, name, password, role, staffID, schedule) {

    let testUser = {
        admin: adminBool,
        email: email,
        joined: new Date(),
        name: name,
        age: 24,
        gender: "Male",
        password: password,
        processes: [],
        role: role,
        staffID: staffID,
        schedule: schedule,
    }

    let addUser = new Users(testUser)

    return addUser.save();

}

function createEquipmentHead(name, quantity, type) {

    let testEquipmentHead = {
        name: name,
        quantity: quantity,
        equipment: [],
        type: type,
    }

    let addEquipmentHead = new EquipmentHeads(testEquipmentHead);

    return addEquipmentHead.save();

}

function createRoom(name, roomID, status, type) {

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


const admin_password = "testpassword"
const saltRounds = 10;
const hashedPass = bcrypt.hashSync(admin_password, saltRounds);

const populate = async () => {

    let testAdmin = await createUser(true, "testadmin@gmail.com", "testAdmin", hashedPass, "admin", 0,
        {
            Monday: [{ start: "00:00", end: "23:59" }],
            Tuesday: [{ start: "00:00", end: "23:59" }],
            Wednesday: [{ start: "00:00", end: "23:59" }],
            Thursday: [{ start: "00:00", end: "23:59" }],
            Friday: [{ start: "00:00", end: "23:59" }],
            Saturday: [{ start: "00:00", end: "23:59" }],
            Sunday: [{ start: "00:00", end: "23:59" }]
        });

    let testDoctor = await createUser(false, "testDoctor@gmail.com", "testDoctor", hashedPass, "Cardiology", 0,
        {
            Monday: [{ start: "00:00", end: "23:59" }],
            Tuesday: [{ start: "00:00", end: "23:59" }],
            Wednesday: [{ start: "00:00", end: "23:59" }],
            Thursday: [{ start: "00:00", end: "23:59" }],
            Friday: [{ start: "00:00", end: "23:59" }],
            Saturday: [{ start: "00:00", end: "23:59" }],
            Sunday: [{ start: "00:00", end: "23:59" }]
        });

    let testDoctor2 = await createUser(false, "testDoctor2@gmail.com", "testDoctor2", hashedPass, "Radiology", 0, {
        Monday: [{ start: "00:00", end: "23:59" }],
        Tuesday: [{ start: "00:00", end: "23:59" }],
        Wednesday: [{ start: "00:00", end: "23:59" }],
        Thursday: [{ start: "00:00", end: "23:59" }],
        Friday: [{ start: "00:00", end: "23:59" }],
        Saturday: [{ start: "00:00", end: "23:59" }],
        Sunday: [{ start: "00:00", end: "23:59" }]
    });

    let testNurse = await createUser(false, "testNurse@gmail.com", "testNurse", hashedPass, "Nurse", 0, {
        Monday: [{ start: "00:00", end: "23:59" }],
        Tuesday: [{ start: "00:00", end: "23:59" }],
        Wednesday: [{ start: "00:00", end: "23:59" }],
        Thursday: [{ start: "00:00", end: "23:59" }],
        Friday: [{ start: "00:00", end: "23:59" }],
        Saturday: [{ start: "00:00", end: "23:59" }],
        Sunday: [{ start: "00:00", end: "23:59" }]
    });

    let testNurse2 = await createUser(false, "testNurse2@gmail.com", "testNurse2", hashedPass, "Nurse", 0, {
        Monday: [{ start: "00:00", end: "23:59" }],
        Tuesday: [{ start: "00:00", end: "23:59" }],
        Wednesday: [{ start: "00:00", end: "23:59" }],
        Thursday: [{ start: "00:00", end: "23:59" }],
        Friday: [{ start: "00:00", end: "23:59" }],
        Saturday: [{ start: "00:00", end: "23:59" }],
        Sunday: [{ start: "00:00", end: "23:59" }]
    });

    let testPatient = await createUser(false, "testPatient@gmail.com", "testPatient", hashedPass, "patient", 0, null);

    let testRoom = await createRoom("Test Room", 3, "Open", "Radiology");

    let testRoom2 = await createRoom("Test Room 2", 4, "Open", "Cardiology");

    let testEquipment2 = await createEquipmentHead("Heart Pacer", 0, "Cardiology");


    if (db) db.close();
    console.log('Test Data Inserted Into Mediflow MongoDB');

}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });
