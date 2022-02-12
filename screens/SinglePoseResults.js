import {MaterialCommunityIcons} from '@expo/vector-icons';
import React, {useEffect, useRef, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  ActivityIndicator,
  Image,
  PixelRatio,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import {useNavigation} from '@react-navigation/native';
import * as tmPose from '@teachablemachine/pose';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {auth} from '../firebase';

import {colors, appStyles} from '../colorConstants';
import {convertImageToTensor} from './helpers/tensor-helper';
import {cropImageToPose, getMinMaxXY} from './helpers/crop-helper';
import {incrementUserScore} from '../firebase/firestore';
// import {score} from '../firebase/firestore';

const PREDICTION_THRESHOLD = 0.8;
const MATCH_LABEL = 'target';

const MATCH_MESSAGE = 'You Got It~!🥳';
const NO_MATCH_MESSAGE = 'You Missed It...😢';
const NO_POSE_MESSAGE = 'Where are you? We got no pose!👀';
const OUT_MESSAGE = 'Out of bounds! Maybe next time.😉';

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();

  const mainViewRef = useRef();
  const modelRef = useRef();

  const [isModelReady, setIsModelReady] = useState(false);
  const [userImage, setUserImage] = useState();
  const [isPoseMatch, setIsPoseMatch] = useState('wait');
  const [poseStatus, setPoseStatus] = useState('wait'); // 'yes', 'no', 'out'
  const [resultMessage, setResultMessage] = useState('');

  const deviceHeight = useWindowDimensions().height;
  const deviceWidth = useWindowDimensions().width;

  useEffect(async () => {
    modelRef.current = route.params?.model;
    await getPoseResults();
  }, []);

  const getPoseResults = async () => {
    await setupBackend();
    const model = await setupModel();
    const image = route.params?.image;
    setUserImage(image);

    const imageTensor = convertImageToTensor(image);
    const {pose, posenetOutput} = await model.estimatePose(imageTensor);

    // web browser and iOS
    if (Platform.OS !== 'android') {
      // if no pose detected
      if (!pose) {
        setPoseStatus('no');
        setResultMessage(NO_POSE_MESSAGE);
      } else {
        const {minX, maxX, minY, maxY} = getMinMaxXY(image.width, image.height, pose);
        if (minX < 0 || maxX > image.width || minY < 0 || maxY > image.height) {
          setPoseStatus('out');
          setResultMessage(OUT_MESSAGE);
        } else {
          const cropImage = await cropImageToPose(image, minY, maxY);
          setUserImage(cropImage);
          const cropTensor = convertImageToTensor(cropImage);
          const {posenetOutput} = await model.estimatePose(cropTensor);
          setPoseStatus('yes');
          const {prediction, probability} = await getHighestPredProb(model, posenetOutput);
          if (prediction === MATCH_LABEL && probability > PREDICTION_THRESHOLD) {
            setIsPoseMatch('yes');
            setResultMessage(MATCH_MESSAGE);
            await incrementUserScore(true);
          } else {
            setIsPoseMatch('no');
            setResultMessage(NO_MATCH_MESSAGE);
            await incrementUserScore(false);
          }
        }
      }
    }
    // Android
    else {
      setPoseStatus('yes');
      const {prediction, probability} = await getHighestPredProb(model, posenetOutput);
      if (prediction === MATCH_LABEL && probability > PREDICTION_THRESHOLD) {
        setIsPoseMatch('yes');
        setResultMessage(MATCH_MESSAGE);
        await incrementUserScore(true);
      } else {
        setIsPoseMatch('no');
        setResultMessage(NO_MATCH_MESSAGE);
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
    const URL = modelRef.current;
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
    auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('MyTabs');
      } else {
        navigation.replace('MyTabsGuest');
      }
    });
  };

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      alert('To share your POSEle results, please download the POSEle mobile app!📱');
      return;
    }

    let content = {
      message:
        'Check out my daily POSEle! Can you beat me? Try it out at https://posele.netlify.app/!',
    };

    if (Platform.OS === 'ios') {
      const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
      // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
      const pixelHeight = deviceHeight / pixelRatio;
      const pixelWidth = deviceWidth / pixelRatio;

      const snapshot = await captureRef(mainViewRef, {
        height: pixelHeight,
        width: pixelWidth,
      });

      content.url = snapshot;
    } else if (Platform.OS === 'android') {
      content.title = 'POSEle Results';
    }

    try {
      await Share.share(content);
    } catch (error) {
      console.error('🧑🏻‍💻 Error', error);
    }
  };

  return (
    <View style={appStyles.mainView} ref={mainViewRef}>
      <View style={[appStyles.insetBox, styles.imageContainer]}>
        <Text style={appStyles.insetHeader}>Your Results:</Text>
        <Image
          style={[appStyles.image, {width: '100%'}]}
          source={userImage ? {uri: userImage.uri} : {uri: route.params.poseImage}}
        ></Image>
      </View>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{resultMessage}</Text>
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
            {isPoseMatch === 'yes' && (
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
            {(poseStatus === 'no' || isPoseMatch === 'no') && (
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
