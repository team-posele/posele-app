import {useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const TIME_LIMIT = 3;
const TIME_ZERO_ICON = '🕺';

export default function Pose() {
  const navigation = useNavigation();

  const [intervalId, setIntervalId] = useState(null);
  const [imageReady, setImageReady] = useState(false);
  const [time, setTime] = useState(TIME_LIMIT);

  useEffect(() => {
    // waits until image has loaded
    if (imageReady) {
      const currIntervalId = setInterval(() => {
        // need to reference time as function parameter for proper update
        setTime(time => {
          if (time > 1) return time - 1;
          return TIME_ZERO_ICON;
        });
      }, 1000);
      setIntervalId(currIntervalId);
    }
  }, [imageReady]);

  useEffect(() => {
    // time over
    if (time === TIME_ZERO_ICON) {
      (async () => {
        clearInterval(intervalId);
        navigation.navigate('CapturePose');
      })();
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <View style={(styles.container, {height: 100})}></View>
      <View style={styles.imageContainer}>
        <Text style={styles.header}>Match the Pose:</Text>
        <Image
          style={styles.image}
          source={require('../assets/jordan-pose.jpg')}
          onLoad={() => {
            setImageReady(true);
          }}
        ></Image>
      </View>
      <View style={styles.container}>
        <Text style={styles.warning}>Remember to Pose Responsibly!</Text>
        <Text style={styles.timer}>{time}</Text>
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
    backgroundColor: '#414BB2CC',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '90%',
    resizeMode: 'contain',
  },
  warning: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  timer: {
    fontSize: 100,
  },
});
