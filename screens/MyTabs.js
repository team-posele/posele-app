import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../firebase';
import {colors, appStyles} from '../colorConstants';
import {getAllUsers, getUser, incrementUserScore, score} from '../firebase/firestore';
import {color} from 'react-native-elements/dist/helpers';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState({});

  function handlePlay() {
    navigation.replace('Warning');
  }

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log(`logged out!`);
        navigation.replace('LandingScreen');
      })
      .catch(error => {
        console.log(`error in handleLogout: ${error}`);
      });
  };

  useEffect(async () => {
    const currentUserDoc = await db
      .collection('users')
      .doc(auth.currentUser.email) // order by score
      .get();
    if (!currentUserDoc.exists) {
      console.log(`get current user FAILED.`);
    } else {
      setCurrentUser(currentUserDoc.data());
    }
  }, []);

  return (
    <View style={appStyles.mainViewScreen}>
      <View style={styles.logOutButton}>
        <TouchableOpacity style={styles.logOutText} onPress={handleLogout}>
          <Text style={appStyles.primaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={appStyles.mainView}>
        <View style={styles.container}>
          <Image
            source={require('../assets/posele-logo.png')}
            style={[appStyles.image, styles.image]}
          />
        </View>

        <View style={styles.container}>
          <Text style={appStyles.heading1}>
            Hello, {currentUser ? currentUser.username : 'User'}
          </Text>
          <Text style={appStyles.heading2}>Welcome back to Posele!</Text>
        </View>
        <View style={styles.container}>
          <Image
            source={require('../assets/sammy-man-and-girl-dancing-at-a-party.png')}
            style={[appStyles.image, styles.image]}
          />
        </View>
        <View style={[styles.container]}>
          <Text style={appStyles.heading2}>
            {currentUser ? (
              `Posele Score: ${currentUser.score}`
            ) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </Text>

          <Text style={appStyles.heading2}>
            {currentUser ? (
              `Current Daily Streak: ${currentUser.currentStreak}`
            ) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </Text>
          <Text style={appStyles.heading2}>
            {currentUser ? (
              `Best Streak: ${currentUser.maxStreak}`
            ) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={handlePlay}
            style={[appStyles.secondaryButton, styles.primaryButton]}
          >
            <Text style={appStyles.secondaryButtonText}>Let's Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    const userz = []; // temporary holder
    await db
      .collection('users') // access users collection
      .orderBy('score', 'desc') // order by score
      .limit(10) // limit to top 10 results
      .get()
      .then(snapshot => {
        // push each result to holder array
        snapshot.docs.forEach(doc => {
          userz.push({...doc.data(), id: doc.id});
        });
      });
    setUsers(userz); // setUsers to the contents of the holder array
    return function resetLeaderboard() {
      // cleanup: clear users on unmount
      setUsers([]);
    };
  }, []);

  return (
    <View style={appStyles.mainView}>
      <View style={[appStyles.screenTitleContainer, styles.title]}>
        <Text style={appStyles.heading1}>Posele Leaderboard</Text>
      </View>
      <View style={styles.LeaderBoardHeader}>
        <Text style={[styles.nameItem, styles.header]}>Username</Text>
        <Text style={[styles.scoreItem, styles.header]}>Score</Text>
      </View>

      <View style={styles.leaderboard}>
        {users[0] ? (
          <FlatList
            data={users}
            renderItem={({item}) => (
              <View style={styles.leaderBoardItems}>
                <Text style={styles.nameItem}>{item.username}</Text>
                <Text style={styles.scoreItem}>{item.score}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <ActivityIndicator size="large" style={styles.statusIcon} color={colors.primary} />
        )}
      </View>
    </View>
  );
};

const Friends = () => {
  return (
    <View style={appStyles.mainView}>
      <Image source={require('../assets/comingSoon.png')} style={styles.image} />
      <Text>This feature is coming soon!</Text>
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
  title: {
    flex: 0.3,
    justifyContent: 'flex-start',
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
    width: '100%',
    height: '55%',
  },
  statusIcon: {},
  LeaderBoardHeader: {
    flex: 0.2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  leaderBoardItems: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  leaderboard: {
    flex: 3,
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  nameItem: {
    marginLeft: '20%',
    flex: 1,
    textAlign: 'left',
    fontSize: 20,
  },
  scoreItem: {
    marginRight: '10%',
    textAlign: 'center',
    flex: 0.3,
    fontSize: 20,
  },
  logOutButton: {
    marginLeft: 25,
    marginTop: 54,
    textAlign: 'left',
  },
});
