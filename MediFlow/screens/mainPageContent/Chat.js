import React, { useState, useEffect } from "react";
import { Provider } from "react-native-paper";
import { Button, TextInput, Text, Avatar, List } from "react-native-paper";

export default function ChatScreen() {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	useEffect(() => {
		const dummyMessages = [
			{ id: 1, sender: "TestAdmin", text: "Hello, how can I help you?" },
			{
				id: 2,
				sender: "You",
				text: "Hi TestAdmin, I have a question about my appointment.",
			},
			{ id: 3, sender: "TestAdmin", text: "Sure, go ahead and ask." },
		];
		setMessages(dummyMessages);
	}, []);

	const handleMessageSubmit = (e) => {
		e.preventDefault();
		// Ensure newMessage is properly defined before updating state
		if (newMessage !== "") {
			const newMessageObj = {
				id: messages.length + 1,
				sender: "You",
				text: newMessage,
			};
			setMessages([...messages, newMessageObj]);
			setNewMessage("");
		}
	};

	const handleInputChange = (text) => {
		// Renamed for clarity
		setNewMessage(text);
	};

	return (
		<Provider>
			<List.Section>
				<List.Subheader>Chat with TestAdmin</List.Subheader>
				{messages.map((message) => (
					<List.Item
						key={message.id}
						title={message.sender}
						description={message.text}
					/>
				))}
			</List.Section>
			<TextInput
				value={newMessage}
				onChangeText={handleInputChange}
				placeholder="Type your message..."
				left={<TextInput.Affix icon="message" />}
			/>
			<Button mode="contained" onPress={handleMessageSubmit}>
				Send
			</Button>
		</Provider>
	);
}
