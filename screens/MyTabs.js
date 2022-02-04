import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../firebase';
import {colors, appStyles} from '../colorConstants';
import * as firestore from 'firebase/firestore';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();

  useEffect(async () => {
    const users = db.collection('users').doc('hxTAarepPjgInAuZz5VD');
    const doc = await users.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
    }
  }, []);

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
    <View style={appStyles.mainView}>
      <View style={styles.container}>
        <Text style={appStyles.heading1}>Hello, {auth.currentUser.email}</Text>
        <Text style={appStyles.heading2}>Welcome back to Posele!</Text>
      </View>
      <View style={[styles.container]}>
        <Image
          source={require('../assets/posele-logo.png')}
          style={[appStyles.image, styles.image]}
        />
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handlePlay}
          style={[appStyles.primaryButton, styles.primaryButton, appStyles.highlight]}
        >
          <Text style={appStyles.primaryButtonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.secondaryButton]}
          onPress={handleLogout}
        >
          <Text style={appStyles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    width: '60%',
    marginTop: 20,
  },
  secondaryButton: {
    width: '60%',
    marginTop: 20,
  },
  image: {
    width: '35%',
    height: '35%',
  },
});
