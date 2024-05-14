/*

    Must be manually run with node init.js

    HardCoded Data -> Admins, Procedures, Processes


*/
const uri =
  "mongodb+srv://luigi:5ppeMdA9V4u417Bk@mediflow.ivvvqti.mongodb.net/?retryWrites=true&w=majority&appName=Mediflow";
const bcrypt = require("bcrypt");
const faker = require("faker");

const departments = [
  "Cardiology",
  "Radiology",
  "Oncology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
];
let Users = require("./models/users.js");
let Procedures = require("./models/procedure.js");
let Equipment = require("./models/equipment.js");
let EquipmentHeads = require("./models/equipmentHead.js");
let Rooms = require("./models/room.js");
let Communication = require("./models/communication.js");
let Processes = require("./models/processes.js");
let Patient = require("./models/Patient.js");
let Appointments = require("./models/appointment.js");

let mongoose = require("mongoose");

let db = mongoose.connection;

// Create Functions

function createUser(
  adminBool,
  email,
  name,
  age,
  gender,
  password,
  role,
  schedule
) {
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
    schedule: schedule,
  };

  let addUser = new Users(createUser);

  return addUser.save();
}

async function createPatient(
  firstName,
  lastName,
  dateOfBirth,
  gender,
  contactNumber,
  email,
  address,
  medicalHistory,
  procedures
) {
  // Check if the patient already exists
  const existingPatient = await Patient.findOne({ email: email });
  if (existingPatient) {
    console.log(`Patient with email ${email} already exists.`);
    return existingPatient; // Return the existing patient instead of creating a new one
  }

  const newPatient = new Patient({
    firstName,
    lastName,
    dateOfBirth,
    gender,
    contactNumber,
    email,
    address,
    medicalHistory,
    appointments: procedures,
  });

  return newPatient.save();
}

async function createEquipmentHead(name, quantity, type, equipmentIds) {
  // Check if the equipment head already exists
  const existingEquipmentHead = await EquipmentHeads.findOne({ name: name });
  if (existingEquipmentHead) {
    console.log(`EquipmentHead ${name} already exists.`);
    return existingEquipmentHead;
  }

  let newEquipmentHead = new EquipmentHeads({
    name: name,
    quantity: quantity,
    type: type,
    equipment: equipmentIds, // Pass the array of ObjectIds directly
  });

  return newEquipmentHead.save();
}

async function createEquipment(name, locationRoom, type) {
  // Check if the equipment already exists
  const existingEquipment = await Equipment.findOne({
    name: name,
    location: locationRoom,
  });
  if (existingEquipment) {
    console.log(`Equipment ${name} already exists in room ${locationRoom}.`);
    return existingEquipment; // Return the existing equipment instead of creating a new one
  }

  let createEquipment = {
    location: locationRoom,
    name: name,
    status: "Functional",
    type: type,
  };

  let addEquipment = new Equipment(createEquipment);

  return addEquipment.save();
}

async function createRoom(name, status, type) {
  // Check if the room already exists
  const existingRoom = await Rooms.findOne({ name: name });
  if (existingRoom) {
    console.log(`Room ${name} already exists.`);
    return existingRoom; // Return the existing room instead of creating a new one
  }

  let createRoom = {
    created: new Date(),
    equipment: [],
    name: name,
    status: status,
    type: type,
    updatedAt: new Date(),
  };

  let addRoom = new Rooms(createRoom);

  return addRoom.save();
}

function createProcedure(
  description,
  estimatedDuration,
  name,
  requiredEquipment,
  requiredRoomType,
  staffType,
  numStaff
) {
  let createProcedure = {
    created: new Date(),
    description: description,
    estimatedDuration: estimatedDuration,
    name: name,
    requiredEquipment: requiredEquipment,
    requiredRoomType: requiredRoomType,
    staffType: staffType,
    numStaff: numStaff,
  };

  let addProcedure = new Procedures(createProcedure);

  return addProcedure.save();
}

function createProcess(name, procedures) {
  let createProcess = {
    name: name,
    components: procedures,
  };

  let addProcess = new Processes(createProcess);

  return addProcess.save();
}

function getRandomSchedule() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let schedule = {};

  days.forEach((day) => {
    let startHour = faker.datatype.number({ min: 6, max: 10 });
    let endHour = startHour + faker.datatype.number({ min: 8, max: 10 });
    schedule[day] = [
      {
        start: `${startHour.toString().padStart(2, "0")}:00`,
        end: `${endHour.toString().padStart(2, "0")}:00`,
      },
    ];
  });

  return schedule;
}

async function createAppointment(patientId, procedureIds, processId, roomIds) {
  const existingAppointment = await Appointments.findOne({
    patient: patientId,
    "procedures.procedure": { $all: procedureIds },
    process: processId,
    // can add more criteria to define uniqueness
  });

  if (existingAppointment) {
    console.log(
      `Appointment already exists for patient ID ${patientId} with process ID ${processId}.`
    );
    return existingAppointment;
  }
  const newAppointment = new Appointments({
    created: new Date(),
    patient: patientId,
    procedures: procedureIds.map((procId) => ({
      procedure: procId,
      room: roomIds[0],
      scheduledStartTime: new Date(),
      scheduledEndTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours later
    })),
    process: processId,
    status: "pending",
  });
  //console.log("created appointment: ", newAppointment);

  try {
    const savedAppointment = await newAppointment.save();
    console.log("Appointment saved:");
  } catch (error) {
    console.error("Error saving appointment:", error);
  }
}

// Populate
const populate = async () => {
  try {
    // Connect to database
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    // Create Rooms
    let storageRoom = await createRoom("Storage Room", "OPEN", "Storage");
    let heartRoom = await createRoom("Room 101", "OPEN", "Cardiology");
    let icu = await createRoom("ICU", "OPEN", "ICU");
    let opRoom = await createRoom("Operating Room 201", "OPEN", "Surgery");
    let maternityRoom = await createRoom("Maternity Room", "OPEN", "Maternity");
    let generalWard = await createRoom("General Ward", "OPEN", "General");

    let baseRoomNumber = 103;
    for (let i = 0; i < departments.length; i++) {
      let roomName = `Room ${baseRoomNumber + i}`;
      let department = departments[i];
      await createRoom(roomName, "OPEN", department);
    }

    // Create Equipment
    let heartLungMachineOne = await createEquipment(
      "Heart-Lung Machine One",
      storageRoom._id,
      "Cardiology"
    );
    let heartLungMachineTwo = await createEquipment(
      "Heart-Lung Machine Two",
      storageRoom._id,
      "Cardiology"
    );
    let equipmentIds = [heartLungMachineOne._id, heartLungMachineTwo._id];
    let heartLungMachineHead = await createEquipmentHead(
      "Heart Lung Machine",
      2,
      "Cardiology",
      equipmentIds
    );

    let ctMachineOne = await createEquipment(
      "CT Machine One",
      storageRoom._id,
      "Radiology"
    );
    let ctMachineTwo = await createEquipment(
      "CT Machine Two",
      storageRoom._id,
      "Radiology"
    );
    let ctMachineHead = await createEquipmentHead(
      "CT Machine",
      2,
      "Radiology",
      [ctMachineOne._id, ctMachineTwo._id]
    );

    let ultrasoundMachine = await createEquipment(
      "Ultrasound Machine",
      maternityRoom._id,
      "Maternity"
    );
    let mriMachine = await createEquipment(
      "MRI Machine",
      generalWard._id,
      "Radiology"
    );

    // Create Procedures and Processes
    let maternityProcedures = [
      await createProcedure(
        "Routine prenatal check-up and ultrasound.",
        45,
        "Prenatal Checkup",
        [ultrasoundMachine._id],
        "Maternity",
        "Nurse",
        2
      ),
      await createProcedure(
        "Delivery procedure and postnatal care.",
        120,
        "Delivery",
        [],
        "Maternity",
        "Obstetrician",
        3
      ),
    ];
    let maternityProcess = await createProcess(
      "Maternity Care",
      maternityProcedures.map((proc) => proc._id)
    );

    let heartSurgeryProcedures = [
      await createProcedure(
        "Patient needs blood tests monitoring, and fasting diet requirements.",
        30,
        "Heart Surgery PreOP",
        [],
        null,
        "Nurse",
        2
      ),
      await createProcedure(
        "Patient needs to undergo anesthesia in which the performing doctor will execute the surgery",
        60,
        "Heart Surgery OP",
        [heartLungMachineHead._id],
        "Cardiology",
        "Cardiology",
        1
      ),
      await createProcedure(
        "Patient needs to rest and be monitored",
        60,
        "Heart Surgery PostOP",
        [ctMachineHead._id],
        "ICU",
        "Radiology",
        1
      ),
    ];
    let heartSurgery = await createProcess(
      "Heart Surgery",
      heartSurgeryProcedures.map((proc) => proc._id)
    );

    let mriProcedure = await createProcedure(
      "Detailed brain imaging to diagnose conditions.",
      90,
      "Brain MRI Scan",
      [mriMachine._id],
      "Radiology",
      "Radiologist",
      1
    );
    let heartProcedure = await createProcedure(
      "Open heart surgery for valve replacement.",
      180,
      "Heart Valve Surgery",
      [],
      "Cardiology",
      "Cardiologist",
      3,
      heartRoom._id
    );
    let generalSurgery = await createProcedure(
      "Appendectomy to remove an inflamed appendix.",
      120,
      "Appendectomy",
      [],
      "Surgery",
      "Surgeon",
      2,
      opRoom._id
    );
    let icuRecovery = await createProcedure(
      "Post-operative recovery and monitoring.",
      240,
      "Post-Op Monitoring",
      [],
      "ICU",
      "Nurse",
      2,
      icu._id
    );

    let mriProcess = await createProcess("MRI Diagnostic", [mriProcedure._id]);
    let heartSurgeryProcess = await createProcess("Heart Valve Surgery", [
      heartProcedure._id,
      icuRecovery._id,
    ]);
    let appendectomyProcess = await createProcess("Appendectomy Surgery", [
      generalSurgery._id,
      icuRecovery._id,
    ]);

    // Create SYS ADMIN
    const admin_password = "sysAdmin";
    const saltRounds = 10;
    const hashedPass = bcrypt.hashSync(admin_password, saltRounds);
    let sysAdmin = await createUser(
      true,
      "sysAdmin@gmail.com",
      "SYSTEM ADMIN",
      28,
      "Male",
      hashedPass,
      "admin",
      {
        Monday: [{ start: "00:00", end: "23:59" }],
        Tuesday: [{ start: "00:00", end: "23:59" }],
        Wednesday: [{ start: "00:00", end: "23:59" }],
        Thursday: [{ start: "00:00", end: "23:59" }],
        Friday: [{ start: "00:00", end: "23:59" }],
        Saturday: [{ start: "00:00", end: "23:59" }],
        Sunday: [{ start: "00:00", end: "23:59" }],
      }
    );

    // Create Patients
    let patient1 = await createPatient(
      "John",
      "Doe",
      new Date(1980, 1, 1),
      "Male",
      "1234567890",
      "john.doe@example.com",
      {
        street: "123 Elm St",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
      },
      [
        {
          condition: "Hypertension",
          diagnosisDate: new Date(2010, 1, 1),
          notes: "Regular monitoring required",
        },
      ],
      [heartSurgery._id]
    );

    let patientJane = await createPatient(
      "Jane",
      "Smith",
      new Date(1990, 3, 15),
      "Female",
      "9876543210",
      "jane.smith@example.com",
      {
        street: "789 Pine St",
        city: "Springfield",
        state: "IL",
        zipCode: "62711",
      },
      [
        {
          condition: "Pregnancy",
          diagnosisDate: new Date(2023, 5, 10),
          notes: "Routine prenatal visits required",
        },
      ],
      [maternityProcess._id]
    );

    let patientTom = await createPatient(
      "Tom",
      "Harris",
      new Date(1975, 7, 22),
      "Male",
      "1231231230",
      "tom.harris@example.com",
      {
        street: "101 Maple St",
        city: "Springfield",
        state: "IL",
        zipCode: "62712",
      },
      [
        {
          condition: "Brain Tumor",
          diagnosisDate: new Date(2023, 6, 30),
          notes: "Requires immediate MRI scan",
        },
      ],
      [mriProcess._id]
    );

    let patientLisa = await createPatient(
      "Lisa",
      "White",
      new Date(1980, 4, 18),
      "Female",
      "3213214321",
      "lisa.white@example.com",
      {
        street: "202 Oak St",
        city: "Springfield",
        state: "IL",
        zipCode: "62715",
      },
      [
        {
          condition: "Heart Valve Issues",
          diagnosisDate: new Date(2023, 7, 15),
          notes: "Scheduled for valve replacement surgery",
        },
      ],
      [heartSurgeryProcess._id]
    );

    let patientRob = await createPatient(
      "Rob",
      "Johnson",
      new Date(1990, 9, 9),
      "Male",
      "431231231",
      "rob.johnson@example.com",
      {
        street: "303 Birch St",
        city: "Springfield",
        state: "IL",
        zipCode: "62716",
      },
      [
        {
          condition: "Appendicitis",
          diagnosisDate: new Date(2023, 8, 1),
          notes: "Emergency appendectomy needed",
        },
      ],
      [appendectomyProcess._id]
    );

    // Create appointments for patients
    for (let procedure of heartSurgeryProcedures) {
      let procedureIds = [procedure._id];
      let roomIds = [icu._id]; // Example room, adjust based on actual room used for the procedure
      await createAppointment(
        patient1._id,
        procedureIds,
        heartSurgery._id,
        roomIds
      );
    }

    console.log("starting appointments");
    // Repeat for other patients and their respective procedures
    for (let procedure of maternityProcedures) {
      let procedureIds = [procedure._id];
      let roomIds = [maternityRoom._id]; // Example room for maternity procedures
      await createAppointment(
        patientJane._id,
        procedureIds,
        maternityProcess._id,
        roomIds
      );
    }

    for (let procedure of [mriProcedure]) {
      let procedureIds = [procedure._id];
      let roomIds = [generalWard._id]; // Example room for MRI
      await createAppointment(
        patientTom._id,
        procedureIds,
        mriProcess._id,
        roomIds
      );
    }

    for (let procedure of [heartProcedure, icuRecovery]) {
      let procedureIds = [procedure._id];
      let roomIds = [heartRoom._id]; // Example room for heart valve surgery
      await createAppointment(
        patientLisa._id,
        procedureIds,
        heartSurgeryProcess._id,
        roomIds
      );
    }

    for (let procedure of [generalSurgery, icuRecovery]) {
      let procedureIds = [procedure._id];
      let roomIds = [opRoom._id]; // Example room for surgery
      await createAppointment(
        patientRob._id,
        procedureIds,
        appendectomyProcess._id,
        roomIds
      );
    }

    console.log("Preset Data Inserted into DB");
  } catch (error) {
    console.log(error);
  } finally {
    if (mongoose.connection.readyState) {
      mongoose.connection.close();
    }
  }
};

populate().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});
