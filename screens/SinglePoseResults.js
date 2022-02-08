import React, {useState, useEffect, useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, appStyles} from '../colorConstants';
import {Icon} from 'react-native-elements';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as tmPose from '@teachablemachine/pose';

import {convertImageToTensor} from './helpers/tensor-helper';
import {cropImageToPose} from './helpers/crop-helper';

// model URL for letterP pose
const URL = 'https://teachablemachine.withgoogle.com/models/u12x4vla4/';
const modelURL = URL + 'model.json';
const metadataURL = URL + 'metadata.json';

// confidence score threshold for valid pose match
const PREDICTION_THRESHOLD = 0.8;

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();

  const backend = useRef();

  const [predictedPose, setPredictedPose] = useState('detecting...');
  const [isModelReady, setIsModelReady] = useState(false);
  const [hasPose, setHasPose] = useState(false);
  const [hasPrediction, setHasPrediction] = useState(false);
  const [poseImage, setPoseImage] = useState();

  const image = route.params?.image;

  const handleDone = () => {
    navigation.replace('MyTabs');
  };

  const handleShare = () => {
    navigation.replace('Share');
  };

  async function init() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') backend.current = 'rn-webgl';
    else backend.current = 'webgl';
    let result = true;
    try {
      result = await tf.setBackend(backend.current);
      console.log('🧑🏻‍💻 result', result);
    } catch (error) {
      console.log(`🧑🏻‍💻 '${backend.current}' backend not available! Using 'cpu' instead.`);
      await tf.setBackend('cpu');
      backend.current = 'cpu';
    }
    if (!result) {
      console.log(`🧑🏻‍💻 '${backend.current}' backend not available! Using 'cpu' instead.`);
      await tf.setBackend('cpu');
      backend.current = 'cpu';
    }

    console.log('🧑🏻‍💻 backend', await tf.getBackend());
    await tf.ready(); // wait until TensorFlow is ready
    const model = await tmPose.load(modelURL, metadataURL);
    setIsModelReady(true);
    const tensor = convertImageToTensor(image);
    setPoseImage(image);
    // const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
    // const pose = (await detector.estimatePoses(tensor))[0]; // array of poses, but only holds 1 pose
    // console.log('🧑🏻‍💻 pose', pose);
    // // const {pose} = await model.estimatePose(tensor);
    // const cropImage = await cropImageToPose(image, pose);
    // const cropTensor = convertImageToTensor(cropImage);
    // const {posenetOutput} = await model.estimatePose(cropTensor);
    const {posenetOutput} = await model.estimatePose(tensor);
    setHasPose(true);
    const prediction = await model.predict(posenetOutput);
    setHasPrediction(true);
    const {className, probability} = prediction.reduce((prevPred, currPred) => {
      if (currPred.probability > prevPred.probability) return currPred;
      return prevPred;
    });
    if (className !== 'idle' && probability > PREDICTION_THRESHOLD) setPredictedPose(className);
    else setPredictedPose('No Match!');
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={appStyles.mainView}>
      <View style={[appStyles.insetBox, styles.imageContainer]}>
        <Text style={appStyles.insetHeader}>Your Results:</Text>
        <ImageBackground
          style={[appStyles.image, {width: '100%'}]}
          fadeDuration={0}
          source={require('../assets/jordan-pose.jpg')}
        >
          <Image
            fadeDuration={3000}
            style={[appStyles.image, {width: '100%'}]}
            source={poseImage ? {uri: poseImage.uri} : require('../assets/posele-logo.png')}
          ></Image>
        </ImageBackground>
      </View>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{predictedPose}</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Loading Model</Text>
            {!isModelReady ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Detecting Pose</Text>
            {!hasPose ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Predicting Match</Text>
            {!hasPrediction ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
        </View>
      </View>
      <View style={[appStyles.container, styles.buttonContainer]}>
        <TouchableOpacity style={[appStyles.secondaryButton, styles.button]} onPress={handleDone}>
          <Text style={appStyles.secondaryButtonText}>Back Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            appStyles.primaryButton,
            styles.button,
            appStyles.highlight,
            !hasPrediction && styles.disabledButton,
          ]}
          onPress={handleShare}
          disabled={!hasPrediction ? true : false}
        >
          <Text
            style={[
              appStyles.primaryButtonText,
              styles.buttonText,
              !hasPrediction && styles.disabledButtonText,
            ]}
          >
            Share
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 3,
    paddingVertical: 20,
    width: '90%',
  },
  statusBox: {
    flex: 1,
    marginVertical: 10,
    borderColor: colors.primary,
    borderWidth: 2,
    padding: 5,
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
  statusText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stepText: {
    color: 'black',
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
    width: '45%',
    justifyContent: 'space-evenly',
  },
  disabledButton: {
    backgroundColor: 'gray',
    borderWidth: 0,
  },
  disabledButtonText: {
    color: 'darkgray',
  },
});
