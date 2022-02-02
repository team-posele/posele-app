import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StatusBar} from 'expo-status-bar';
import colors from '../colorConstants';

export default function Warning() {
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.container}></View>
      <View style={styles.instructionsView}>
        <Text style={[styles.instructionsText, styles.instructionsHeader]}>Playing Posele:</Text>
        <Text style={styles.instructionsText}>
          1. When you click Pose Now, you will see an image
        </Text>
        <Text style={styles.instructionsText}>2. Your device camera will start</Text>
        <Text style={styles.instructionsText}>
          3. You have five seconds to line up your shot and match the pose in the image.
        </Text>
        <Text style={[styles.instructionsText, styles.instructionsHeader]}>Good luck! </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/cameraWarning.jpg')}></Image>
        <Image style={styles.image} source={require('../assets/movement.png')}></Image>
      </View>
      <Text style={styles.warning}>
        Please move to a location where you have room to move around and permission to take
        pictures. Be aware of other people, pets, and objects.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.smallButton]}>
          <Text
            style={[styles.buttonText, styles.smallButtonText]}
            onPress={() => navigation.replace('MyTabs')}
          >
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => navigation.replace('DisplayPose')}>
            Pose Now!
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsView: {
    flex: 2,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    backgroundColor: colors.secondary,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  instructionsText: {
    // backgroundColor: "#414BB2",
    color: 'white',
    fontSize: 16,
    padding: 5,
  },
  instructionsHeader: {
    // backgroundColor: "#414BB2",
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
  },
  warning: {
    color: 'red',
    textAlign: 'center',
    width: '85%',
    fontSize: 20,
    margin: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: '35%',
    margin: 5,
  },
  button: {
    backgroundColor: colors.primary,
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  smallButton: {
    width: '25%',
    backgroundColor: 'white',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  smallButtonText: {color: colors.primary},
});
