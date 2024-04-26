// TEMPORARY RENAME

import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "./screens/LoginPage";
import axios from "axios";
import { getByLabelText } from "@testing-library/react";

jest.mock("axios"); // Mock axios for network requests

describe("LoginScreen", () => {
	it("renders correctly", () => {
		const tree = renderer.create(<LoginScreen />).toJSON();
		expect(tree).toMatchSnapshot();
	});
it("displays an error message for invalid input", async () => {
	const { getByText, getByPlaceholderText } = render(<LoginScreen />);

	// Simulate button press without input
	fireEvent.press(getByText("Login"));

	// Wait for the error to be displayed
	await waitFor(() => expect(getByText("Invalid Input")).toBeTruthy());
});

it("calls the login API when valid credentials are entered", async () => {
	// Set up a mock response
	axios.post.mockResolvedValueOnce({ data: { success: true } });

	const { getByText, getByPlaceholderText } = render(<LoginScreen />);

	// Fill in the fields
	fireEvent.changeText(getByLabelText("Email"), "testDoctor@gmail.com");
	fireEvent.changeText(getByLabelText("Password"), "testpassword");
	fireEvent.press(getByText("Login"));

	// Expect axios to have been called with correct data
	await waitFor(() => {
		expect(axios.post).toHaveBeenCalledWith(
			"https://mediflow-cse416.onrender.com/login",
			{ username: "testDoctor@gmail.com", password: "testpassword" },
			{ withCredentials: true }
		);
	});
});

});
