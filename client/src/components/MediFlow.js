import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";

export default function MediFlow() {
	return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/main/*" element={<MainPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
	);
}