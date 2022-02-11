import * as ImageManipulator from 'expo-image-manipulator';

const DIMENSION = 256;
const MARGIN_PERCENTAGE = 5;

export const getMinMaxXY = (width, height, pose) => {
  let {minX, maxX, minY, maxY} = pose.keypoints.reduce(
    (minMax, keyPoint) => {
      // for checking above hips
      if (!['leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'].includes(keyPoint.part)) {
        const {x, y} = keyPoint.position;
        if (x < minMax.minX) minMax.minX = x;
        if (x > minMax.maxX) minMax.maxX = x;
        if (y < minMax.minY) minMax.minY = y;
        if (y > minMax.maxY) minMax.maxY = y;
      }
      return minMax;
    },
    {minX: width, maxX: 0, minY: height, maxY: 0}
  );
  return {minX, maxX, minY, maxY};
};

export const checkBoundaries = async (width, height, minX, maxX, minY, maxY) => {
  if (minX < 0 || maxX > width || minY < 0 || maxY > height) return true;
  else return false;
};

export const cropImageToPose = async (image, minX, maxX, minY, maxY) => {
  const width = image.width;
  const height = image.height;

  // add upper and lower padding
  const widthMargin = width * (MARGIN_PERCENTAGE / 100.0);
  if (minX - widthMargin > 0) minY -= widthMargin;
  if (maxX + widthMargin < width) maxY += widthMargin;

  const heightMargin = height * (MARGIN_PERCENTAGE / 100.0);
  if (minY - heightMargin > 0) minY -= heightMargin;
  if (maxY + heightMargin < height) maxY += heightMargin;

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
