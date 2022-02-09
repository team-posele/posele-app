import {storage} from '../firebase';

const CLOUD_STORAGE_MODEL_DIR = 'model-letterP-simple/';

export const loadModelFromFiles = () => {
  const modelURL = await storage.ref(CLOUD_STORAGE_MODEL_DIR + 'model.json').getDownloadURL();
  const modelResult = await fetch(modelURL);
  const modelBlob = await modelResult.blob();
  const modelFile = new File([modelBlob], 'model.json');

  const weightsURL = await storage.ref(CLOUD_STORAGE_MODEL_DIR + 'weights.bin').getDownloadURL();
  const weightsResult = await fetch(weightsURL);
  const weightsBlob = await weightsResult.blob();
  const weightsFile = new File([weightsBlob], 'weights.bin');

  const metadataURL = await storage.ref(CLOUD_STORAGE_MODEL_DIR + 'metadata.json').getDownloadURL();
  const metadataResult = await fetch(metadataURL);
  const metadataBlob = await metadataResult.blob();
  const metadataFile = new File([metadataBlob], 'metadata.json');

  const model = await tmPose.loadFromFiles(modelFile, weightsFile, metadataFile);

  return model;
}

