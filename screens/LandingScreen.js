import {useEffect} from 'react';
import {auth} from '../firebase';

import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appStyles} from '../colorConstants';

const LandingScreen = () => {
  const navigate = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate.replace('MyTabs');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.main}>
      <Image
        style={styles.image}
        source={require('../assets/sammy-girl-in-a-yoga-pose-stands-on-one-leg.png')}
      ></Image>
      <Text style={styles.heading}>Let’s Strike a Pose and have fun</Text>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => {
          navigate.replace('SignUp');
        }}
      >
        <Text style={styles.signUpText}>I'm New Here</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => {
          navigate.replace('SignIn');
        }}
      >
        <Text style={appStyles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LandingScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFAF4E',
  },
  image: {
    flex: 16,
    resizeMode: 'contain',
    width: '80%',
    alignSelf: 'center',
    marginTop: 30,
  },
  heading: {
    flex: 4,
    color: 'white',
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  signUpButton: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInButton: {
    flex: 1,
    marginTop: 15,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
