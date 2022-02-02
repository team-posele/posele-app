import React, {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../colorConstants';
import {Icon} from 'react-native-elements';

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();

  const imageUri = route.params?.image?.uri;
  // grab the imageUri if passed in, avoid errors if it isn't

  const handleDone = () => {
    navigation.replace('MyTabs');
  };
  // "back home" button handler

  const [statusText, setStatusText] = useState('Please Wait...');
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  let coinFlip = Math.round(Math.random()); //random win/lose for now
  console.log(`imageUri: ${imageUri}`); // to check whether prop is being picked up

  useEffect(() => {
    // waits until image has loaded
    const currIntervalId = setInterval(() => {
      // need to reference time as function parameter for proper update
      setTime(time => {
        if (time < 5) return time + 1;
        return 5;
      });
    }, 1000);
    setIntervalId(currIntervalId);
  }, []);

  useEffect(() => {}, [time]);

  useEffect(() => {
    // time over
    if (time === 5) {
      (async () => {
        clearInterval(intervalId);
        // stop updating timer once it reaches 5 seconds
      })();
    }
  }, [time]);
  useEffect(() => {
    if (time >= 4) {
      setStatusText(
        coinFlip
          ? 'You matched the pose! Congratulations!'
          : 'You did not match the pose. Try again tomorrow!'
      );
    }
  }, [time]);

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
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{statusText}</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Processing Image</Text>

            {time < 1 ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Comparing to Source</Text>
            {time < 2 ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Rendering Verdict</Text>
            {time < 4 ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDone}>
          <Text style={styles.buttonText}>Back Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {borderColor: colors.accent, borderWidth: 5}]}
          onPress={handleDone}
        >
          <Text style={styles.buttonText}>Share</Text>
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
    flex: 3,
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
  statusBox: {
    flex: 1,
    marginVertical: 10,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  statusContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '85%',
    justifyContent: 'space-evenly',
  },
  statusItem: {
    flex: 1,
  },
  statusText: {color: colors.primary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'},
  stepText: {
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorStatusText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIcon: {
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
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
