import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appStyles} from '../colorConstants';

const LandingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/sammy-girl-in-a-yoga-pose-stands-on-one-leg.png')}
      ></Image>
      <Text style={styles.heading}>Let’s Strike a Pose and have fun</Text>
    </View>
  );
};
export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F57366',
  },
  image: {
    width: 329,
    height: 417,
    marginTop: 45,
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
});
