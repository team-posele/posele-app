import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../firebase';
import {colors, appStyles} from '../colorConstants';
import {getAllUsers, getUser, incrementUserScore, score} from '../firebase/firestore';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();

  function handlePlay() {
    navigation.replace('Warning');
  }

  const handleLogout = () => {
    navigation.replace('LandingScreen');
  };

  return (
    <View style={appStyles.mainView}>
      <View style={styles.container}>
        <Text style={appStyles.heading1}>Hello</Text>
        <Text style={appStyles.heading2}>Welcome back to Posele!</Text>
      </View>
      <View style={[styles.container]}>
        <Text style={appStyles.heading2}>
          <ActivityIndicator size="small" color={colors.primary} />
        </Text>
        <Image
          source={require('../assets/posele-logo.png')}
          style={[appStyles.image, styles.image]}
        />
        <Text style={appStyles.heading2}>
          <ActivityIndicator size="small" color={colors.primary} />
        </Text>
        <Text style={appStyles.heading2}>
          <ActivityIndicator size="small" color={colors.primary} />
        </Text>
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
          <Text style={appStyles.secondaryButtonText}>Exit Posele</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

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
  }, [refreshing]);

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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({item}) => (
              <View style={styles.leaderBoardItems}>
                <Text style={styles.nameItem} ellipsizeMode={'tail'} numberOfLines={1}>
                  {item.username}
                </Text>
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
      <Text style={appStyles.heading1}>This feature is coming soon!</Text>
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
    resizeMode: 'contain',
  },
  statusIcon: {},
  LeaderBoardHeader: {
    flex: 0.2,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  leaderBoardItems: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 3,
  },
  leaderboard: {
    flex: 3,
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '85%',
  },
  leaderBoardSelfText: {
    fontWeight: 'bold',
    color: 'black',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  nameItem: {
    // marginLeft: '15%',
    // flex: 1,
    textAlign: 'left',
    fontSize: 20,
    width: '70%',
    paddingRight: 10,
    marginLeft: 8,
    color: 'white',
  },
  scoreItem: {
    // marginRight: '10%',
    textAlign: 'right',
    // flex: 0.3,
    fontSize: 20,
    width: '18%',
    color: 'white',
  },
  logOut: {
    marginLeft: 25,
    marginTop: 50,
    textAlign: 'left',
  },
  logOutButton: {
    // flex: 1,
    // alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderRadius: 100,
    // justifyContent: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    padding: 5,
  },
  logOutBtnText: {
    fontWeight: 'bold',
  },
  imgContainer: {
    width: 388,
    height: 274,
  },
});
