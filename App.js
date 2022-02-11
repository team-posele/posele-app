import React from 'react';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useBackHandler} from '@react-native-community/hooks';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyTabs from './screens/MyTabs';
import DisplayPose from './screens/DisplayPose';
import CapturePose from './screens/CapturePose';
import SignIn from './screens/Login';
import Warning from './screens/Warning';
import SinglePoseResults from './screens/SinglePoseResults';
import NoPose from './screens/NoPose';
import Share from './screens/Share';
import LandingScreen from './screens/LandingScreen';
import SignUp from './screens/SignUp';
import MyTabsGuest from './screens/MyTabsGuest';

LogBox.ignoreLogs([
  'AsyncStorage has been extracted ',
  'Platform browser has already been set',
  'Setting a timer',
  'Initialization of backend',
  'Error: GL is currently',
  'Remote debugger',
]); // hide unnecessary warnings

const Stack = createNativeStackNavigator();

export default function App() {
  useBackHandler(() => {
    return true;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Warning" options={{headerShown: false}} component={Warning} />
        <Stack.Screen
          name="LandingScreen"
          options={{headerShown: false}}
          component={LandingScreen}
        />
        <Stack.Screen name="SignIn" options={{headerShown: false}} component={SignIn} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUp} />
        <Stack.Screen name="MyTabs" options={{headerShown: false}} component={MyTabs} />
        <Stack.Screen name="MyTabsGuest" options={{headerShown: false}} component={MyTabsGuest} />
        <Stack.Screen name="DisplayPose" options={{headerShown: false}} component={DisplayPose} />
        <Stack.Screen name="CapturePose" options={{headerShown: false}} component={CapturePose} />
        <Stack.Screen name="Results" options={{headerShown: false}} component={SinglePoseResults} />
        <Stack.Screen name="NoPose" options={{headerShown: false}} component={NoPose} />
        <Stack.Screen name="Share" options={{headerShown: false}} component={Share} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
