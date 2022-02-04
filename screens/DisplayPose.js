import {useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, appStyles} from '../colorConstants';

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
        navigation.replace('CapturePose');
      })();
    }
  }, [time]);

  return (
    <View style={appStyles.mainView}>
      <View style={[appStyles.insetBox, styles.imageContainer]}>
        <Text style={appStyles.insetHeader}>Match the Pose:</Text>
        <Image
          style={styles.image}
          source={require('../assets/jordan-pose.jpg')}
          onLoad={() => {
            setImageReady(true);
          }}
        ></Image>
      </View>
      <View style={appStyles.container}>
        <Text style={appStyles.warningText}>Remember to Pose Responsibly!</Text>
        <Text style={appStyles.timer}>{time}</Text>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 20,
    width: '90%',
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
