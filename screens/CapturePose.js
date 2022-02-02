import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Camera} from 'expo-camera';
import {manipulateAsync, FlipType} from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';

export default () => {
  const navigation = useNavigation();

  const cameraRef = useRef();

  const [cameraPermission, setCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [cameraReady, setCameraReady] = useState(false);
  const [mediaPermission, setMediaPermission] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [time, setTime] = useState(5);

  useEffect(() => {
    (async () => {
      const cameraResponse = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraResponse.status === 'granted');
      const mediaResponse = await MediaLibrary.requestPermissionsAsync(true);
      setMediaPermission(mediaResponse.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // prevents timer from starting while camera is still loading
    if (cameraReady) {
      const currIntervalId = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
      setIntervalId(currIntervalId);
    }
  }, [cameraReady]);

  useEffect(() => {
    if (time <= 0) {
      (async () => {
        console.log("🧑🏻‍💻 time's up!");
        clearInterval(intervalId);
        savePose();
      })();
    }
  }, [time]);

  const savePose = async () => {
    const image = await cameraRef.current.takePictureAsync({
      base64: true,
    });
    const mirrorImage = await manipulateAsync(image.uri, [{flip: FlipType.Horizontal}]);
    if (mediaPermission) await MediaLibrary.saveToLibraryAsync(mirrorImage.uri);
    else console.log('🧑🏻‍💻 Media permission not granted!');
    navigation.navigate('Results', {image: mirrorImage});
  };

  if (cameraPermission === null) return <View />;
  if (cameraPermission === false) return <Text>No access to camera</Text>;
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        autoFocus={true}
        onCameraReady={() => {
          setCameraReady(true);
        }}
      ></Camera>
      <Text style={styles.timer}>{time > 0 ? `${time}` : '📸'}</Text>
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
