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

  useEffect(() => {
    const storedIsAdmin = sessionStorage.getItem("isAdmin") === "true";
    setIsAdmin(storedIsAdmin);
  }, []);

  return (
    <DataContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);