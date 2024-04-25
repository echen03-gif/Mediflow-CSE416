import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import Logo from '../components/Logo'
import axios from 'axios'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loginError, setLoginError] = useState(""); // State to handle login error messages

  const onLoginPressed = async () => {
		setLoginError("");
		if (email.value === "" || password.value === "") {
			setLoginError("Invalid Input");
		} else {
			try {
				const res = await axios.post(
					"https://mediflow-cse416.onrender.com/login",
					{ username: email.value, password: password.value },
					{ withCredentials: true }
				);

				console.log(res.data);
				if (res.data.success) {
					navigation.reset({
						index: 0,
						routes: [{ name: "MainScreen" }],
					});
				} else {
					console.log("Error");
					setLoginError(res.data.message);
				}
			} catch (error) {
				setLoginError("Error, please try again!");
				console.error(error);
			}
		}
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed} style={styles.login}>
        Login
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  login: {
    backgroundColor: theme.colors.secondary
  },
})