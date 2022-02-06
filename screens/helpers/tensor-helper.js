import {decodeJpeg} from '@tensorflow/tfjs-react-native';

// 0: channel from JPEG-encoded image
// 1: gray scale
// 3: RGB image
const TENSORFLOW_CHANNEL = 3;
const KEYSTRING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export const convertImageToTensor = image => {
  try {
    // format base64 image data
    const base64 = image.base64.replace(/^data:image\/(png|jpeg);base64,/, '');
    // decode a JPEG-encoded image to a 3D Tensor of dtype
    const uIntArray = decode(base64);
    // reshape Tensor into a 3D array
    const tensor = decodeJpeg(uIntArray, TENSORFLOW_CHANNEL);
    return tensor;
  } catch (error) {
    console.log('Could not convert base64 string to tensor', error);
  }
};

const decode = input => {
  //get last chars to see if are valid
  input = removePaddingChars(removePaddingChars(input));

  const bytes = parseInt((input.length / 4) * 3, 10);

  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;

  let uarray = new Uint8Array(bytes);

  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  let j = 0;
  for (let i = 0; i < bytes; i += 3) {
    //get the 3 octects in 4 ascii chars
    enc1 = KEYSTRING.indexOf(input.charAt(j++));
    enc2 = KEYSTRING.indexOf(input.charAt(j++));
    enc3 = KEYSTRING.indexOf(input.charAt(j++));
    enc4 = KEYSTRING.indexOf(input.charAt(j++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    uarray[i] = chr1;
    if (enc3 !== 64) {
      uarray[i + 1] = chr2;
    }
    if (enc4 !== 64) {
      uarray[i + 2] = chr3;
    }
  }
  return uarray;
};

const removePaddingChars = input => {
  let lKey = KEYSTRING.indexOf(input.charAt(input.length - 1));
  if (lKey === 64) {
    return input.substring(0, input.length - 1);
  }
  return input;
};
