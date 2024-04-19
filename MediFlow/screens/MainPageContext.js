import React, { createContext, useState } from 'react';

const MainPageContext = createContext();

const MainPageContextProvider = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState('Schedule');
  console.log(activeComponent);
  const contextValue = {
    activeComponent,
    setActiveComponent,
  };

  return (
    <MainPageContext.Provider value={contextValue}>
      {children}
    </MainPageContext.Provider>
  );
};

export { MainPageContext, MainPageContextProvider };
