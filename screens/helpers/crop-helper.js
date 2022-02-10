import * as ImageManipulator from 'expo-image-manipulator';

const DIMENSION = 256;
const HEIGHT_MARGIN_PERCENTAGE = 0.1;

export const getMinMaxXY = (width, height, pose) => {
  let {minX, maxX, minY, maxY} = pose.keypoints.reduce(
    (minMax, keyPoint) => {
      // for checking above hips
      // if (!['leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'].includes(keyPoint.part)) {
      // }
      const {x, y} = keyPoint.position;
      if (x < minMax.minX) minMax.minX = x;
      if (x > minMax.maxX) minMax.maxX = x;
      if (y < minMax.minY) minMax.minY = y;
      if (y > minMax.maxY) minMax.maxY = y;
      return minMax;
    },
    {minX: width, maxX: 0, minY: height, maxY: 0}
  );
  return {minX, maxX, minY, maxY};
};

export const cropImageToPose = async (image, minY, maxY) => {
  const width = image.width;
  const height = image.height;

  // adjust height to fit square
  const heightMargin = height * HEIGHT_MARGIN_PERCENTAGE;
  minY = Math.min(minY - heightMargin, 0);
  maxY = Math.max(maxY + heightMargin, DIMENSION);

  const actions = [
    {
      crop: {
        originX: 0,
        originY: minY,
        width: width,
        height: maxY,
      },
    },
    {
      // accommodate different heights
      resize: {
        width: DIMENSION,
        height: DIMENSION,
      },
    },
  ];
  const saveOptions = {
    base64: true,
  };
  return await ImageManipulator.manipulateAsync(image.uri, actions, saveOptions);
};
