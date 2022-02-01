import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import {Camera} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default () => {
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
    console.log('🧑🏻‍💻 time', time);
    if (time <= 0) {
      console.log("🧑🏻‍💻 time's up!");
      clearInterval(intervalId);
    }
  }, [time]);

  const handleCapture = async () => {
    if (!cameraReady) console.log('🧑🏻‍💻 Camera is not ready!');
    else {
      console.log('🧑🏻‍💻 start timer');
      const currIntervalId = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
      setIntervalId(currIntervalId);

      // const imageData = await cameraRef.current.takePictureAsync({
      //   base64: true,
      // });
      // if (mediaPermission) await MediaLibrary.saveToLibraryAsync(imageData.uri);
      // else console.log('🧑🏻‍💻 Media permission not granted!');
    }
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
      <Pressable
        onPress={() => handleCapture()}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'gray' : 'white',
          },
          styles.captureButton,
        ]}
      ></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    position: 'absolute',
    left: Dimensions.get('screen').width / 2 - 50,
    bottom: 40,
    width: 100,
    zIndex: 100,
    height: 100,
    borderRadius: 50,
  },
});
