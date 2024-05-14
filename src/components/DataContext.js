import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
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

  const api = useMemo(() => axios.create({
    baseURL: "https://mediflow-cse416.onrender.com",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  }), []);

  const useApi = async (endpoint, method = "GET", body = null) => {
    try {
      const response = await api({
        method,
        url: endpoint,
        data: body,
      });
      return response.data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  const updateData = (newData) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const getStatus = (schedule) => {
    if (!schedule) {
      return "NOT AVAILABLE";
    }
    //console.log("schedule", schedule)
    let currentDay, now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight
    currentDay = now.toLocaleString("default", { weekday: "long" });

    const todaysSchedule = schedule[currentDay];
    //console.log(currentDay);

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
      //console.log(shiftEnd);
      //console.log(shiftStart);
      if (currentTime >= shiftStart && currentTime <= shiftEnd) {
        return "ON DUTY";
      }
    }

    return "NOT AVAILABLE";
  };

  useEffect(() => {
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
  }, [api]);
  
  useEffect(() => {
    const storedIsAdmin = sessionStorage.getItem("isAdmin") === "true";
    setIsAdmin(storedIsAdmin);
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        updateData,
        useApi,
        appointmentList,
        inventoryHeadList,
        equipmentDB,
        roomList,
        usersList,
        isAdmin,
        setIsAdmin,
        peopleList,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = () => useContext(DataContext);
