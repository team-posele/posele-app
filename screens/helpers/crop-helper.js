import * as ImageManipulator from 'expo-image-manipulator';

const DIMENSION = 256;
const MARGIN_PERCENTAGE = 15;

export const cropImageToPose = async (imageData, pose) => {
  const width = imageData.width;
  const height = imageData.height;
  let {minY, maxY} = pose.keypoints.reduce(
    (minMax, keyPoint) => {
      const y = keyPoint.position.y;
      if (y < minMax.minY) minMax.minY = y;
      if (y > minMax.maxY && y < height) minMax.maxY = keyPoint.position.y;
      return minMax;
    },
    {minY: height, maxY: 0}
  );
  // add upper and lower padding
  const heightMargin = height / MARGIN_PERCENTAGE;
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
      resize: {
        width: DIMENSION,
        height: DIMENSION,
      },
    },
  ];
  const saveOptions = {
    base64: true,
    compress: 0.5,
  };
  return await ImageManipulator.manipulateAsync(imageData.uri, actions, saveOptions);
};
