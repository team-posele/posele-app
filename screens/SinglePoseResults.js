import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../colorConstants';

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();

  const imageUri = route.params?.image?.uri;

  const handleDone = () => {
    navigation.replace('MyTabs');
  };

  let coinFlip = Math.round(Math.random());
  console.log(`imageUri: ${imageUri}`);

  return (
    <View style={styles.container}>
      {/* <View style={(styles.container, {height: 100})}></View> */}
      <View style={styles.imageContainer}>
        <Text style={styles.header}>Your Results:</Text>
        <ImageBackground
          style={styles.sourceImage}
          fadeDuration={0}
          source={require('../assets/jordan-pose.jpg')}
        >
          <Image
            style={styles.userImage}
            fadeDuration={3000}
            source={imageUri ? {uri: imageUri} : require('../assets/photo.jpg')}
          ></Image>
        </ImageBackground>
      </View>
      <View style={styles.container}>
        {coinFlip === 0 ? (
          <Text style={styles.matchText}>You're a Winner!</Text>
        ) : (
          <Text style={styles.noMatchText}>You're a loser!</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={handleDone}>
            Back Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={handleDone}>
            Share
          </Text>
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
    marginTop: 100,
    flex: 2,
    alignItems: 'center',
    paddingVertical: 20,
    width: '90%',
    backgroundColor: colors.secondary,
    justifyContent: 'center',
  },
  sourceImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  userImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
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
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: colors.primary,
    width: '45%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
