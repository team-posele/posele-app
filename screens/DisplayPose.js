import * as FileSystem from 'expo-file-system';
import {StatusBar} from 'expo-status-bar';
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Image, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {colors, appStyles} from '../colorConstants';
import {db, storage} from '../firebase';

const TIME_LIMIT = 3;
const TIME_ZERO_ICON = '🕺';

export default function Pose() {
  const navigation = useNavigation();

  const modelRef = useRef();

  const [intervalId, setIntervalId] = useState(null);
  const [imageReady, setImageReady] = useState(false);
  const [poseName, setPoseName] = useState('');
  const [poseImage, setPoseImage] = useState('');
  const [time, setTime] = useState(TIME_LIMIT);

  useEffect(async () => {
    try {
      const numPoses = (await db.collection('pose-models').get()).size;
      const randPoseIndex = Math.floor(Math.random() * numPoses);
      console.log('🧑🏻‍💻 numPoses, randPoseIndex', numPoses, randPoseIndex);
      // const pose = db.collection('pose-models').doc(`${randPoseIndex}`);
      const pose = db.collection('pose-models').doc('0');
      const poseDoc = await pose.get();
      const {image, name, url} = poseDoc.data();
      modelRef.current = url;
      const imageURL = await storage.ref('pose-images/' + image).getDownloadURL();

      // use URL sources for web
      if (Platform.OS === 'web') {
        setPoseImage(imageURL);
      }
      // use URI sources for devices
      else {
        const {uri} = await FileSystem.downloadAsync(imageURL, FileSystem.cacheDirectory + image);
        setPoseImage(uri);
      }

      setPoseName(name);
    } catch (error) {
      console.error('🧑🏻‍💻 Error occurred while getting pose model', error);
    }
  }, []);

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
        navigation.navigate('CapturePose', {poseImage: poseImage, model: modelRef.current});
      })();
    }
  }, [time]);

  return (
    <View style={appStyles.mainView}>
      <View style={[appStyles.insetBox, styles.imageContainer]}>
        <Text style={appStyles.insetHeader}>Match the Pose:</Text>
        {!poseImage ? (
          <ActivityIndicator size="large" style={styles.image} color={colors.secondary} />
        ) : (
          <Image
            style={styles.image}
            source={{uri: poseImage}}
            onLoad={() => {
              setImageReady(true);
            }}
          />
        )}
        <Text style={appStyles.insetHeader}>{poseName}</Text>
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
  statusIcon: {
    alignSelf: 'center',
  },
});
