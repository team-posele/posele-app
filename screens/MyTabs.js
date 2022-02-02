import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {auth} from '../firebase';
import colors from '../colorConstants';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();

  function handlePlay() {
    navigation.replace('Warning');
  }

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log(`logged out!`);
        navigation.replace('Login');
      })
      .catch(error => {
        console.log(`error in handleLogout: ${error}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Hello, {auth.currentUser.email}</Text>
      <Text style={styles.h2}>Welcome back to Posele!</Text>
      <TouchableOpacity onPress={handlePlay} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText} onPress={handleLogout}>
          Logout
        </Text>
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
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'LeaderBoard') {
            iconName = focused ? 'list' : 'list';
          } else if (route.name === 'Friends') {
            iconName = 'people';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
      <Tab.Screen name="LeaderBoard" component={LeaderBoard} options={{headerShown: false}} />
      <Tab.Screen name="Friends" component={Friends} options={{headerShown: false}} />
    </Tab.Navigator>
  );
};

export default MyTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    fontSize: 20,
  },
  h2: {
    fontSize: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    width: '60%',
    padding: 10,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderColor: colors.secondary,
    borderWidth: 3,
    width: '60%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
