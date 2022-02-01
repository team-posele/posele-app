import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../colorConstants';

export default function SinglePoseResults() {
  const navigation = useNavigation();

  const handleReady = () => {
    navigation.replace('MyTabs');
  };

  let coinFlip = Math.round(Math.random());

  return (
    <View style={styles.container}>
      <View style={(styles.container, {height: 100})}></View>
      <View style={styles.imageContainer}>
        <Text style={styles.header}>Your Results:</Text>
        <Image
          style={styles.sourceImage}
          fadeDuration={3000}
          source={require('../assets/jordan-pose.jpg')}
        ></Image>
        <Image style={styles.userImage} source={require('../assets/photo.jpg')}></Image>
      </View>
      <View style={styles.container}>
        {coinFlip === 0 ? (
          <Text style={styles.matchText}>You're a Winner!</Text>
        ) : (
          <Text style={styles.noMatchText}>You're a loser!</Text>
        )}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Pose Now!</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 20,
    width: '90%',
    backgroundColor: colors.secondary,
    justifyContent: 'center',
  },
  sourceImage: {
    flex: 1,
    width: '90%',
    resizeMode: 'contain',
  },
  userImage: {
    flex: 1,
    width: '90%',
    resizeMode: 'contain',
    zIndex: -2,
  },
  noMatchText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  matchText: {
    color: 'green',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.primary,
    width: '85%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
