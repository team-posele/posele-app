import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../firebase';
import {colors, appStyles} from '../colorConstants';
import {getAllUsers, getUser, score} from '../firebase/firestore';

const Tab = createBottomTabNavigator();
let users = [];

// created function to add users to array
const pushToArray = doc => {
  users.push({...doc.data(), id: doc.id});
};

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

  let currentUser;
  const dbButton = async () => {
    // console.log(auth.currentUser.email);
    const currentUserDoc = await db
      .collection('users')
      .doc(auth.currentUser.email) // order by score
      // .limit(10) // limit to top 10 results
      .get();
    if (!currentUserDoc.exists) {
      console.log(`get current user FAILED.`);
    } else {
      // console.log('currentUser data:', currentUserDoc.data());
      currentUser = currentUserDoc.data();
      console.log(currentUser.username);
    }
  };

  return (
    <View style={appStyles.mainView}>
      <View style={styles.container}>
        <Text style={appStyles.heading1}>Hello, jerk</Text>
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
          onPress={dbButton}
          style={[appStyles.primaryButton, styles.primaryButton, appStyles.highlight]}
        >
          <Text style={appStyles.primaryButtonText}>database thing</Text>
        </TouchableOpacity>
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
    <View style={styles.container}>
      <Text>This feature is coming soon!</Text>
    </View>
  );
};

const MyTabs = () => {
  useEffect(async () => {
    // gets all the users from the database
    await db
      .collection('users')
      .orderBy('score', 'desc') // order by score
      .limit(10) // limit to top 10 results
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          pushToArray(doc);
        });
      });
  }, []);
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
    width: '35%',
    height: '35%',
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
});
