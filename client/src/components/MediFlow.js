import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import { MainPageProvider } from "./MainPageContext";

export default function MediFlow() {
	return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route 
                    path="/main/*"
                    element={
                        <MainPageProvider>
                            <MainPage />
                        </MainPageProvider>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
	);
}