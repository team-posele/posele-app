import {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Camera} from 'expo-camera';
import {manipulateAsync, FlipType} from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';

const TIME_LIMIT = 1;
const TIME_ZERO_ICON = '📸';

export default () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const cameraRef = useRef();

  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);
  const [time, setTime] = useState(TIME_LIMIT);
  const [type, setType] = useState(Camera.Constants.Type.front);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const cameraResponse = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraResponse.status === 'granted');
      const mediaResponse = await MediaLibrary.requestPermissionsAsync(true);
      setMediaPermission(mediaResponse.status === 'granted');
    })();
    return () => {
      isMounted = false;
    };
  }, []);

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
      const image = await cameraRef.current.takePictureAsync({
        base64: true,
      });
      // mirrors image horizontally
      const mirrorImage = await manipulateAsync(image.uri, [{flip: FlipType.Horizontal}]);
      if (mediaPermission) await MediaLibrary.saveToLibraryAsync(mirrorImage.uri);
      else console.log('🧑🏻‍💻 Media permission not granted!');
      navigation.replace('Results', {image: mirrorImage});
    } catch (error) {
      navigation.replace('NoPose');
    }
  };

  if (cameraPermission === null) return <View />;
  if (cameraPermission === false) return <Text>No access to camera</Text>;
  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          autoFocus={true}
          onCameraReady={() => {
            setCameraReady(true);
          }}
        ></Camera>
      )}
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
  camera: {
    width: '100%',
    height: '100%',
  },
  timer: {
    position: 'absolute',
    fontSize: 200,
    color: 'white',
  },
});
