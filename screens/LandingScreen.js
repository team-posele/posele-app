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
    <View style={styles.mainView}>
      <Image
        style={styles.image}
        source={require('../assets/sammy-girl-in-a-yoga-pose-stands-on-one-leg.png')}
      ></Image>
      <Text style={styles.heading}>Let’s Strike a Pose and have fun</Text>
      <TouchableOpacity
        style={[appStyles.secondaryButton, styles.signupButton]}
        onPress={() => {
          navigate.replace('SignUp');
        }}
      >
        <Text style={appStyles.secondaryButtonText}>I'm New Here</Text>
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
  mainView: {
    backgroundColor: '#FFAF4E',
  },
  image: {
    alignSelf: 'center',
    width: 329,
    height: 417,
    marginTop: 70,
    marginLeft: 20,
  },
  heading: {
    alignSelf: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    padding: 0,
    fontSize: 36,
    fontWeight: '500',
    color: '#fff',
  },
  signupButton: {
    marginTop: 50,
    marginBottom: 15,
  },
  signInButton: {
    // margin: 5,
    backgroundColor: '#FFAF4E',
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
});
