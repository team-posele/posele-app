import * as ImageManipulator from 'expo-image-manipulator';

const DIMENSION = 256;
const MARGIN_PERCENTAGE = 15;

export const cropImageToPose = async (image, pose) => {
  const width = image.width;
  const height = image.height;
  let {minY, maxY} = pose.keypoints.reduce(
    (minMax, keyPoint) => {
      const y = keyPoint.position.y;
      if (y < minMax.minY && y > 0) minMax.minY = y;
      if (y > minMax.maxY && y < height) minMax.maxY = y;
      return minMax;
    },
    {minY: height, maxY: 0}
  );
  console.log('🧑🏻‍💻 minY, maxY', minY, maxY);
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
    // { // might be helpful for model prediction
    //   resize: {
    //     width: DIMENSION,
    //     height: DIMENSION,
    //   },
    // },
  ];
  const saveOptions = {
    base64: true,
    // compress: 0.5,
  };
  return await ImageManipulator.manipulateAsync(image.uri, actions, saveOptions);
};
