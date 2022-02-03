import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as tmPose from '@teachablemachine/pose';
import {bundleResourceIO, decodeJpeg, fetch} from '@tensorflow/tfjs-react-native';

import {Base64Binary} from '../utils/utils';
const BITMAP_DIMENSION = 224;

const URL = 'https://teachablemachine.withgoogle.com/models/u8KiGFbNq/';
const modelURL = URL + 'model.json';
const metadataURL = URL + 'metadata.json';

// const modelJson = require('../model/model.json');
// const modelWeights = require('../model/weights.bin');

// 0: channel from JPEG-encoded image
// 1: gray scale
// 3: RGB image
const TENSORFLOW_CHANNEL = 3;

export const getModel = async () => {
  try {
    // wait until tensorflow is ready
    await tf.ready();
    // load the trained model

    return await tmPose.load(modelURL, metadataURL);
  } catch (error) {
    console.log('Could not load model', error);
  }
};

export const convertBase64ToTensor = async base64 => {
  try {
    const uIntArray = Base64Binary.decode(base64);
    // decode a JPEG-encoded image to a 3D Tensor of dtype
    const decodedImage = decodeJpeg(uIntArray, 3);
    // reshape Tensor into a 4D array
    return decodedImage;
  } catch (error) {
    console.log('Could not convert base64 string to tesor', error);
  }
};

export const startPrediction = async (model, tensor) => {
  try {
    // predict against the model
    const output = await model.predict(tensor.reshape(null, 14739));
    console.log(output);
    // return typed array
    return output.dataSync();
  } catch (error) {
    console.log('Error predicting from tesor image', error);
  }
};
