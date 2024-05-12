import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

export default function MediFlow() {
	return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset/:token" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/main/*" element={<MainPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
	);
}