import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyTabs from './screens/MyTabs';
import DisplayPose from './screens/DisplayPose';
import CapturePose from './screens/CapturePose';
import Login from './screens/Login';
import Warning from './screens/Warning';
import SinglePoseResults from './screens/SinglePoseResults';
import NoPose from './screens/NoPose';
import Share from './screens/Share';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Share" options={{headerShown: false}} component={Share} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
        <Stack.Screen name="MyTabs" options={{headerShown: false}} component={MyTabs} />
        <Stack.Screen name="DisplayPose" options={{headerShown: false}} component={DisplayPose} />
        <Stack.Screen name="Warning" options={{headerShown: false}} component={Warning} />
        <Stack.Screen name="CapturePose" options={{headerShown: false}} component={CapturePose} />
        <Stack.Screen name="Results" options={{headerShown: false}} component={SinglePoseResults} />
        <Stack.Screen name="NoPose" options={{headerShown: false}} component={NoPose} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
