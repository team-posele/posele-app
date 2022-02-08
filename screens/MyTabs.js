import {StyleSheet, Text, TouchableOpacity, View, Image, FlatList} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../firebase';
import {colors, appStyles} from '../colorConstants';

const Tab = createBottomTabNavigator();
let users = [];

// created function to add users to array
const pushToArray = doc => {
  users.push({...doc.data(), id: doc.id});
  users.sort((a, b) => b.score - a.score);
};

// gets all the users from the database
db.collection('users')
  .get()
  .then(snapshot => {
    snapshot.docs.forEach(doc => {
      pushToArray(doc);
    });
  });

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
    <View>
      {/* <Text>Leader Board!</Text> */}
      <View style={styles.LeaderBoardHeader}>
        <Text>Username</Text>
        <Text>Score</Text>
      </View>

      <View>
        <FlatList
          data={users}
          renderItem={({item}) => (
            <View style={styles.LeaderBoardItems}>
              <Text>{item.name}</Text>
              <Text>{item.score}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
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
  LeaderBoardHeader: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  LeaderBoardItems: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
});
