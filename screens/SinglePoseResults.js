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
  Platform,
  Share,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import * as tmPose from '@teachablemachine/pose';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import {convertImageToTensor} from './helpers/tensor-helper';
import {cropImageToPose} from './helpers/crop-helper';
import {colors, appStyles} from '../colorConstants';
// import {storage} from '../firebase';
import {incrementUserScore} from '../firebase/firestore';
// import {score} from '../firebase/firestore';

// const CLOUD_STORAGE_MODEL_DIR = 'model-letterP-simple/';
const PREDICTION_THRESHOLD = 0.8;
const NON_MATCH_LABEL = 'idle';

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();

  const [predictedPose, setPredictedPose] = useState('detecting...');
  const [isModelReady, setIsModelReady] = useState(false);
  const [hasPose, setHasPose] = useState(false);
  const [hasPrediction, setHasPrediction] = useState(false);
  const [poseImage, setPoseImage] = useState();

  useEffect(async () => {
    await getPoseResults();
  }, []);

  const getPoseResults = async () => {
    await setupBackend();
    const model = await setupModel();
    const image = route.params?.image;
    const posenetOutput = await getPosenetOutput(model, image);
    const {prediction, probability} = await getHighestPredProb(model, posenetOutput);
    if (prediction !== NON_MATCH_LABEL && probability > PREDICTION_THRESHOLD) {
      setPredictedPose(prediction);
      await incrementUserScore(true);
    } else {
      setPredictedPose('No Match!');
      await incrementUserScore(false);
    }
  };

  const setupBackend = async () => {
    switch (Platform.OS) {
      case 'ios':
        await tf.setBackend('rn-webgl');
        break;
      case 'android':
        await tf.setBackend('cpu');
        break;
      default:
        await tf.setBackend('webgl');
        break;
    }
  };

  const setupModel = async () => {
    // wait until TensorFlow is ready
    await tf.ready();

    // const URL = 'https://teachablemachine.withgoogle.com/models/u12x4vla4/'; // for letterP
    const URL = 'https://teachablemachine.withgoogle.com/models/A02NxPriM/'; // for Nathan Chen pose
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    const model = await tmPose.load(modelURL, metadataURL);

    // const modelURL = await storage.ref(CLOUD_STORAGE_MODEL_DIR + 'model.json').getDownloadURL();
    // const modelResult = await fetch(modelURL);
    // const modelBlob = await modelResult.blob();
    // const modelFile = new File([modelBlob], 'model.json');

    // const weightsURL = await storage.ref(CLOUD_STORAGE_MODEL_DIR + 'weights.bin').getDownloadURL();
    // const weightsResult = await fetch(weightsURL);
    // const weightsBlob = await weightsResult.blob();
    // const weightsFile = new File([weightsBlob], 'weights.bin');

    // const metadataURL = await storage
    //   .ref(CLOUD_STORAGE_MODEL_DIR + 'metadata.json')
    //   .getDownloadURL();
    // const metadataResult = await fetch(metadataURL);
    // const metadataBlob = await metadataResult.blob();
    // const metadataFile = new File([metadataBlob], 'metadata.json');

    // const model = await tmPose.loadFromFiles(modelFile, weightsFile, metadataFile);
    setIsModelReady(true);
    return model;
  };

  const getPosenetOutput = async (model, image) => {
    const imageTensor = convertImageToTensor(image);
    // running on webgl
    if (Platform.OS !== 'android') {
      const {pose} = await model.estimatePose(imageTensor);
      const cropImage = await cropImageToPose(image, pose);
      setPoseImage(image);
      // setPoseImage(cropImage); // display cropped image sent to model
      const cropTensor = convertImageToTensor(cropImage);
      const {posenetOutput} = await model.estimatePose(cropTensor);
      setHasPose(true);
      return posenetOutput;
    }
    // running on cpu for Android devices
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

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message:
          predictedPose === 'letterP'
            ? `I matched today's posele! Can you? Play posele today and find out! www.posele.com`
            : `I didn't match today's posele! Think you can do better? www.posele.com #posele`,
        url: 'https://www.posele.com',
        title: "I'm a poser!",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={appStyles.mainView}>
      <View style={[appStyles.insetBox, styles.imageContainer]}>
        <Text style={appStyles.insetHeader}>Your Results:</Text>

        <Image
          style={[appStyles.image, {width: '100%'}]}
          source={poseImage ? {uri: poseImage.uri} : require('../assets/refImg.jpg')}
        ></Image>
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
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.secondary} />
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

    width: '85%',
    justifyContent: 'space-evenly',
  },
  statusItem: {
    flex: 1,
  },
  statusText: {
    color: colors.secondary,
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
