import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTabs from "./screens/MyTabs";
import DisplayPose from "./screens/DisplayPose";
import CapturePose from "./screens/CapturePose";
import Login from "./screens/Login";
import Warning from "./screens/Warning";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={Login}
        />
        <Stack.Screen
          name="MyTabs"
          options={{ headerShown: false }}
          component={MyTabs}
        />
        <Stack.Screen
          name="DisplayPose"
          options={{ headerShown: false }}
          component={DisplayPose}
        />
        <Stack.Screen
          name="Warning"
          options={{ headerShown: false }}
          component={Warning}
        />
        <Stack.Screen
          name="CapturePose"
          options={{ headerShown: false }}
          component={CapturePose}
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
