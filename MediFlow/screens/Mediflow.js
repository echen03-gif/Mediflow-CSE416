import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./LoginPage";
import ResetPasswordScreen from "./ResetPasswordScreen";
import MainPage from "./MainPage";
import { MainPageContextProvider } from "./MainPageContext";

const Stack = createNativeStackNavigator();

export default function MediFlow() {
	return (
		<MainPageContextProvider>
			<NavigationContainer>
				<Stack.Navigator>
					{/*<Stack.Screen name="Login" component={LoginPage} />*/}
					<Stack.Screen
						name="LoginScreen"
						component={LoginPage}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="MainScreen"
						component={MainPage}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ResetPasswordScreen"
						component={ResetPasswordScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</MainPageContextProvider>
	);
}
