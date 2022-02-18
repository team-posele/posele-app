import {Camera} from 'expo-camera';
import {manipulateAsync, FlipType} from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const TIME_LIMIT = 5;
const TIME_ZERO_ICON = '📸';
const DIMENSION = 256 * 2;

export default ({route}) => {
  const navigation = useNavigation();

  const cameraRef = useRef();
  const modelRef = useRef();
  const poseImageRef = useRef();

  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);
  const [time, setTime] = useState(TIME_LIMIT);

  const deviceWidth = useWindowDimensions().width;

  useEffect(async () => {
    modelRef.current = route.params.model;
    poseImageRef.current = route.params.poseImage;
    const cameraResponse = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraResponse.status === 'granted');
    const mediaResponse = await MediaLibrary.requestPermissionsAsync(true);
    setMediaPermission(mediaResponse.status === 'granted');
  }, []);

  // useEffect(() => {
  //   if (cameraPermission === false) {

  //   }
  // }, [cameraPermission]);

  useEffect(() => {
    // waits until camera has loaded

    if (cameraReady) {
      const currIntervalId = setInterval(() => {
        // need to reference time as function parameter for proper update
        setTime(time => {
          if (time > 1) return time - 1;
          return TIME_ZERO_ICON;
        });
      }, 1000);
      setIntervalId(currIntervalId);
    }
  }, [cameraReady]);

  useEffect(() => {
    // time over
    if (time === TIME_ZERO_ICON) {
      clearInterval(intervalId);
      savePose();
    }
  }, [time]);

  const savePose = async () => {
    try {
      const options = {
        base64: true,
      };
      const image = await cameraRef.current.takePictureAsync(options);
      // mirrors image horizontally
      let actions;
      if (Platform.OS !== 'android') {
        actions = [
          {
            flip: FlipType.Horizontal,
          },
          {
            resize: {
              width: DIMENSION,
            },
          },
        ];
      } else {
        actions = [
          {
            flip: FlipType.Horizontal,
          },
          {
            resize: {
              width: DIMENSION,
              height: DIMENSION,
            },
          },
        ];
      }
      const saveOptions = {
        base64: true,
      };
      const mirrorImage = await manipulateAsync(image.uri, actions, saveOptions);
      if (mediaPermission) await MediaLibrary.saveToLibraryAsync(mirrorImage.uri);
      navigation.replace('Results', {
        image: mirrorImage,
        model: modelRef.current,
        poseImage: poseImageRef.current,
      });
    } catch (error) {
      navigation.replace('NoPose');
    }
  };

  if (cameraPermission === null) return <View />;
  if (cameraPermission === false) {
    alert(
      'To play POSEle, you must let us see your pose...👀 Please allow your camera permission to join the fun!🕺'
    );
    navigation.replace('LandingScreen');
  }
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={
          Platform.OS !== 'android'
            ? styles.cameraIos
            : {
                width: deviceWidth,
                height: deviceWidth,
              }
        }
        type={Camera.Constants.Type.front}
        autoFocus={true}
        onCameraReady={() => {
          setCameraReady(true);
        }}
      ></Camera>
      <Text style={styles.timer}>{cameraReady ? time : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIos: {
    width: '100%',
    height: ' 100%',
  },
  timer: {
    position: 'absolute',
    fontSize: 200,
    color: 'white',
  },
});
