import {MaterialCommunityIcons} from '@expo/vector-icons';
import React, {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as tmPose from '@teachablemachine/pose';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import {convertImageToTensor} from './helpers/tensor-helper';
import {cropImageToPose, getMinMaxXY} from './helpers/crop-helper';
import {colors, appStyles} from '../colorConstants';
import {incrementUserScore} from '../firebase/firestore';
// import {score} from '../firebase/firestore';

const PREDICTION_THRESHOLD = 0.8;
const NON_MATCH_LABEL = 'idle';

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();

  const [isModelReady, setIsModelReady] = useState(false);
  const [poseImage, setPoseImage] = useState();
  const [poseStatus, setPoseStatus] = useState('wait'); // 'yes', 'no', 'out'
  const [predictedPose, setPredictedPose] = useState('detecting...');

  useEffect(async () => {
    await getPoseResults();
  }, []);

  const getPoseResults = async () => {
    await setupBackend();
    const model = await setupModel();
    const image = route.params?.image;
    setPoseImage(image);

    const imageTensor = convertImageToTensor(image);
    const {pose, posenetOutput} = await model.estimatePose(imageTensor);

    // web browser and iOS
    if (Platform.OS !== 'android') {
      // if no pose detected
      if (!pose) {
        setPoseStatus('no');
        setPredictedPose('Where are you? We got no pose!👀');
      } else {
        const {minX, maxX, minY, maxY} = getMinMaxXY(image.width, image.height, pose);
        if (minX < 0 || maxX > image.width || minY < 0 || maxY > image.height) {
          setPoseStatus('out');
          setPredictedPose('Out of bounds! Maybe next time.😉');
        } else {
          const cropImage = await cropImageToPose(image, minY, maxY);
          setPoseImage(cropImage);
          const cropTensor = convertImageToTensor(cropImage);
          const {posenetOutput} = await model.estimatePose(cropTensor);
          setPoseStatus('yes');
          const {prediction, probability} = await getHighestPredProb(model, posenetOutput);
          if (prediction !== NON_MATCH_LABEL && probability > PREDICTION_THRESHOLD) {
            setPredictedPose(prediction);
            await incrementUserScore(true);
          } else {
            setPredictedPose('No Match!');
            await incrementUserScore(false);
          }
        }
      }
    }
    // Android
    else {
      setPoseStatus('yes');
      const {prediction, probability} = await getHighestPredProb(model, posenetOutput);
      if (prediction !== NON_MATCH_LABEL && probability > PREDICTION_THRESHOLD) {
        setPredictedPose(prediction);
        await incrementUserScore(true);
      } else {
        setPredictedPose('No Match!');
        await incrementUserScore(false);
      }
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
    // const URL = 'https://teachablemachine.withgoogle.com/models/A02NxPriM/'; // for Nathan Chen pose
    const URL = 'https://teachablemachine.withgoogle.com/models/UnCKhU13r/'; // for Nathan Chen pose
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    const model = await tmPose.load(modelURL, metadataURL);
    setIsModelReady(true);
    return model;
  };

  const getHighestPredProb = async (model, posenetOutput) => {
    const posePrediction = await model.predict(posenetOutput);
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
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.secondary} />
            ) : (
              <MaterialCommunityIcons
                style={styles.statusIcon}
                name="check-circle"
                size={24}
                color="green"
              />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Detecting Pose</Text>
            {poseStatus === 'wait' && (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.secondary} />
            )}
            {(poseStatus === 'yes' || poseStatus === 'out') && (
              <MaterialCommunityIcons
                style={styles.statusIcon}
                name="check-circle"
                size={24}
                color="green"
              />
            )}
            {poseStatus === 'no' && (
              <MaterialCommunityIcons
                style={styles.statusIcon}
                name="close-circle"
                size={24}
                color="red"
              />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Predicting Match</Text>
            {poseStatus === 'wait' && (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.secondary} />
            )}
            {poseStatus === 'yes' && (
              <MaterialCommunityIcons
                style={styles.statusIcon}
                name="check-circle"
                size={24}
                color="green"
              />
            )}
            {poseStatus === 'out' && (
              <MaterialCommunityIcons
                style={styles.statusIcon}
                name="alert-circle"
                size={24}
                color="gray"
              />
            )}
            {poseStatus === 'no' && (
              <MaterialCommunityIcons
                style={styles.statusIcon}
                name="close-circle"
                size={24}
                color="red"
              />
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
            poseStatus === 'wait' && styles.disabledButton,
          ]}
          onPress={handleShare}
          disabled={poseStatus === 'wait' ? true : false}
        >
          <Text
            style={[
              appStyles.primaryButtonText,
              styles.buttonText,
              poseStatus === 'wait' && styles.disabledButtonText,
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
    alignItems: 'center',
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
    width: '40%',
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
