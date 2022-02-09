import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appStyles} from '../colorConstants';

const LandingScreen = () => {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
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
        <Text style={appStyles.secondaryButtonText}>I'm New here</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signinButton}
        onPress={() => {
          navigate.replace('SignIn');
        }}
      >
        <Text style={appStyles.primaryButtonText}>SignIn</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFAF4E',
  },
  image: {
    width: 329,
    height: 417,
    marginTop: 70,
    marginLeft: 20,
  },

  heading: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,

    padding: 0,
    fontSize: 36,
    fontWeight: '500',
    color: '#fff',
  },
  signupButton: {
    marginTop: 90,
    marginBottom: 15,
  },
  signinButton: {
    margin: 5,
    alignItems: 'center',
  },
});
