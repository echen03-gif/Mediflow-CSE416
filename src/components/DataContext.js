import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [appointmentList, setAppointmentList] = useState([]);
  const [inventoryHeadList, setInventoryHead] = useState([]);
  const [equipmentDB, setEquipmentDB] = useState([]);
  const [roomList, setRooms] = useState([]);
  const [usersList, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [peopleList, setPeople] = useState([]);

  const api = axios.create({
    baseURL: "https://mediflow-cse416.onrender.com",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  });

  const updateData = (newData) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const getStatus = (schedule) => {
    const now = new Date();
    const currentDay = now.toLocaleString("default", { weekday: "long" });
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight

    const todaysSchedule = schedule[currentDay];
    console.log(todaysSchedule, currentDay);

    if (!todaysSchedule) {
      return "NOT AVAILABLE";
    }

    for (let i = 0; i < todaysSchedule.length; i++) {
      const shiftStart =
        parseInt(todaysSchedule[i].start.split(":")[0]) * 60 +
        parseInt(todaysSchedule[i].start.split(":")[1]); // Shift start time in minutes since midnight
      const shiftEnd =
        parseInt(todaysSchedule[i].end.split(":")[0]) * 60 +
        parseInt(todaysSchedule[i].end.split(":")[1]); // Shift end time in minutes since midnight
      console.log(shiftEnd);
      console.log(shiftStart);
      if (currentTime >= shiftStart && currentTime <= shiftEnd) {
        return "ON DUTY";
      }
    }

    return "NOT AVAILABLE";
  };

  useEffect(() => {
    let userId = sessionStorage.getItem("user");
    api.get("/equipmentHead").then((res) => setInventoryHead(res.data));
    api.get("/rooms").then((res) => setRooms(res.data));
    api.get("/equipment").then((res) => setEquipmentDB(res.data));
    api.get("/appointments").then((res) => setAppointmentList(res.data));

    api.get("/users").then((res) => {
      const usersWithStatus = res.data.map((user) => {
        return { ...user, status: getStatus(user.schedule) };
      });
      setUsers(usersWithStatus);
      setPeople(res.data);
    });

    api.get(`/userID/${userId}`).then((res) => {
      setIsAdmin(res.data.role === "admin");
      console.log("found user role");
    });
  }, [api]);

  return (
    <DataContext.Provider
      value={{
        data,
        updateData,
        appointmentList,
        inventoryHeadList,
        equipmentDB,
        roomList,
        usersList,
        isAdmin,
        peopleList,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = () => useContext(DataContext);
