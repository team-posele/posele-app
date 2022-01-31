import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTabs from "./screens/MyTabs";
import DisplayPose from "./screens/DisplayPose";
import CapturePose from "./screens/CapturePose";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{/* <Stack.Screen name="MyTabs" component={MyTabs} />
				<Stack.Screen name="DisplayPose" component={DisplayPose} /> */}
				<Stack.Screen
					name="CapturePose"
					component={CapturePose}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
