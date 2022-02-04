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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, appStyles} from '../colorConstants';
import {Icon} from 'react-native-elements';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as tmPose from '@teachablemachine/pose';
import {convertBase64ToTensor, getModel, startPrediction} from '../src/helpers/tensor-helper';
import {cropPicture} from '../src/helpers/image-helper';

export default function SinglePoseResults({route}) {
  const navigation = useNavigation();
  const imageRef = useRef(null);

  const imageUri = route.params?.image?.uri;
  const imageData = route.params?.image;
  // grab the imageUri if passed in, avoid errors if it isn't

  const handleDone = () => {
    navigation.replace('MyTabs');
  };
  // "back home" button handler

  const [statusText, setStatusText] = useState('Please Wait...');
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [presentedPose, setPresentedPose] = useState('');

  let coinFlip = Math.round(Math.random()); //random win/lose for now
  // console.log(`imageUri: ${imageUri}`); // to check whether prop is being picked up

  async function init() {
    // await tf.setBackend('cpu');

    // await tf.ready();
    // const URL = 'https://teachablemachine.withgoogle.com/models/u8KiGFbNq/';
    // const modelURL = URL + 'model.json';
    // const metadataURL = URL + 'metadata.json';

    // const model = await tmPose.load(modelURL, metadataURL);
    const croppedData = await cropPicture(imageData, 300);
    const model = await getModel();
    // console.log('CROPPED DATA: ', croppedData);

    // console.log('MODEL: ', model);
    const maxPredictions = model.getTotalClasses();
    // console.log('CLASSES ', maxPredictions);

    let newData = croppedData.base64.replace(/^data:image\/(png|jpeg);base64,/, '');
    // console.log(newData);

    // console.log(croppedData.uri);

    const tensor = await convertBase64ToTensor(newData);
    // console.log(tensor);

    const {pose, posenetOutput} = await model.estimatePose(tensor);

    // console.log(pose);
    // console.log(posenetOutput);

    const prediction = await model.predict(posenetOutput);
    // console.log(prediction);
    let predictedPose = prediction.filter(pose => {
      return pose.probability > 0.5;
    });
    // console.log(predictedPose[0].className);
    setPresentedPose(predictedPose[0].className);
  }

  useEffect(() => {
    (async () => {
      init();
    })();
    // waits until image has loaded
    const currIntervalId = setInterval(() => {
      // need to reference time as function parameter for proper update
      setTime(time => {
        if (time < 5) return time + 1;
        return 5;
      });
    }, 1000);
    setIntervalId(currIntervalId);
  }, []);

  useEffect(() => {}, [time]);

  useEffect(() => {
    // time over
    if (time === 5) {
      (async () => {
        clearInterval(intervalId);
        // stop updating timer once it reaches 5 seconds
      })();
    }
  }, [time]);
  useEffect(() => {
    if (time >= 4) {
      setStatusText(
        coinFlip
          ? 'You matched the pose! Congratulations!'
          : 'You did not match the pose. Try again tomorrow!'
      );
    }
  }, [time]);

  return (
    <View style={appStyles.mainView}>
      {/* <View style={(styles.container, {height: 100})}></View> */}
      <View style={[appStyles.insetBox, styles.imageContainer]}>
        <Text style={appStyles.insetHeader}>Your Results:</Text>
        <ImageBackground
          style={[appStyles.image, {width: '100%'}]}
          fadeDuration={0}
          source={require('../assets/jordan-pose.jpg')}
        >
          <Image

            style={[appStyles.image, {width: '100%'}]}

            fadeDuration={3000}
            source={imageUri ? {uri: imageUri} : require('../assets/photo.jpg')}
          ></Image>
        </ImageBackground>
      </View>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{statusText}</Text>
        <Text style={styles.statusText}>{presentedPose}</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Processing Image</Text>

            {time < 1 ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Comparing to Source</Text>
            {time < 2 ? (
              <ActivityIndicator size="small" style={styles.statusIcon} color={colors.primary} />
            ) : (
              <Icon style={styles.statusIcon} name={'check-circle'} size={24} color={'green'} />
            )}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.stepText}>Rendering Verdict</Text>
            {time < 4 ? (
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
          style={[appStyles.primaryButton, styles.button, appStyles.highlight]}
          onPress={handleDone}
        >
          <Text style={[appStyles.primaryButtonText, styles.buttonText]}>Share</Text>
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
});
