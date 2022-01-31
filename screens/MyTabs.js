import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-ionicons";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
	const navigation = useNavigation();

	function handlePlay() {
		navigation.replace("DisplayPose");
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePlay} style={styles.button}>
				<Text style={styles.buttonText}>Play</Text>
			</TouchableOpacity>
		</View>
	);
};

const LeaderBoard = () => {
	return (
		<View style={styles.container}>
			<Text>Leader Board!</Text>
		</View>
	);
};

const Friends = () => {
	return (
		<View style={styles.container}>
			<Text>Friends List!</Text>
		</View>
	);
};

const MyTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Home") {
						iconName = focused
							? "ios-information-circle"
							: "ios-information-circle-outline";
					} else if (route.name === "LeaderBoard") {
						iconName = focused ? "ios-list-box" : "ios-list";
					} else if (route.name === "Friends") {
						iconName = "people";
					}

					// You can return any component that you like here!
					return <Icon name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "#0782F9",
				tabBarInactiveTintColor: "gray",
			})}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="LeaderBoard"
				component={LeaderBoard}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Friends"
				component={Friends}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);
};

export default MyTabs;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#0782F9",
		width: "60%",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});
