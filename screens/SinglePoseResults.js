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

import {colors, appStyles} from '../colorConstants';
import {Icon} from 'react-native-elements';
// import {score} from '../firebase/firestore';
import {convertImageToTensor} from './helpers/tensor-helper';
// import {cropImageToPose} from './helpers/crop-helper';

const URL = 'https://teachablemachine.withgoogle.com/models/u12x4vla4/'; // for letterP
const modelURL = URL + 'model.json';
const metadataURL = URL + 'metadata.json';
const PREDICTION_THRESHOLD = 0.8;
const NON_MATCH_LABEL = 'idle';

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();

  const [predictedPose, setPredictedPose] = useState('detecting...');
  const [isModelReady, setIsModelReady] = useState(false);
  const [hasPose, setHasPose] = useState(false);
  const [hasPrediction, setHasPrediction] = useState(false);
  const [poseImage, setPoseImage] = useState();

  useEffect(() => {
    getPoseResults();
  }, []);

  const getPoseResults = async () => {
    const backend = await setupBackend();
    const model = await setupModel();
    const image = route.params?.image;
    const posenetOutput = await getPosenetOutput(model, image, backend);
    const {prediction, probability} = await getHighestPredProb(model, posenetOutput);
    if (prediction !== NON_MATCH_LABEL && probability > PREDICTION_THRESHOLD)
      setPredictedPose(prediction);
    else setPredictedPose('No Match!');
  };

  const setupBackend = async () => {
    let backend = '';
    // mobile backend
    if (Platform.OS === 'ios' || Platform.OS === 'android') backend = 'rn-webgl';
    // web backend
    else backend = 'webgl';
    const hasBackend = await tf.setBackend(backend);
    // if no webgl backend, choose cpu backend
    if (!hasBackend) {
      console.log(`🧑🏻‍💻 '${backend}' not available! Using 'cpu' instead.`);
      backend = 'cpu';
      await tf.setBackend(backend);
    }
    return backend;
  };

  const setupModel = async () => {
    // wait until TensorFlow is ready
    await tf.ready();
    const model = await tmPose.load(modelURL, metadataURL);
    setIsModelReady(true);
    return model;
  };

  const getPosenetOutput = async (model, image, backend) => {
    const imageTensor = convertImageToTensor(image);
    // running on webgl
    if (backend !== 'cpu') {
      const {pose} = await model.estimatePose(imageTensor);
      const cropImage = await cropImageToPose(image, pose);
      setPoseImage(image);
      // setPoseImage(cropImage); // display cropped image sent to model
      const cropTensor = convertImageToTensor(cropImage);
      const {posenetOutput} = await model.estimatePose(cropTensor);
      setHasPose(true);
      return posenetOutput;
    }
    // running on cpu
    else {
      setPoseImage(image);
      const {posenetOutput} = await model.estimatePose(imageTensor);
      setHasPose(true);
      return posenetOutput;
    }
  };

  const getHighestPredProb = async (model, posenetOutput) => {
    const posePrediction = await model.predict(posenetOutput);
    setHasPrediction(true);
    const {className: prediction, probability} = posePrediction.reduce((prevPred, currPred) => {
      if (currPred.probability > prevPred.probability) return currPred;
      else return prevPred;
    });
    return {prediction, probability};
  };

  const handleDone = () => {
    navigation.replace('MyTabs');
  };

  const handleShare = () => {
    navigation.replace('Share');
  };

  return (
    <View style={appStyles.mainView}>
      <View style={[appStyles.insetBox, styles.imageContainer]}>
        <Text style={appStyles.insetHeader}>Your Results:</Text>
        <ImageBackground
          style={[appStyles.image, {width: '100%'}]}
          source={require('../assets/jordan-pose.jpg')}
        >
          <Image
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
