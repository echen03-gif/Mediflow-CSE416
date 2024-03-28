import React, { createContext, useState, useContext } from "react";

// Creating the context
export const MainPageContext = createContext();

export const useMainPageContext = () => useContext(MainPageContext);

export const MainPageProvider = ({ children }) => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<MainPageContext.Provider value={{ activeTab, setActiveTab }}>
			{children}
		</MainPageContext.Provider>
	);
};
