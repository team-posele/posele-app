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
import {colors, appStyles} from '../colorConstants';

export default function Warning() {
  const navigation = useNavigation();

  return (
    <View style={[appStyles.mainView]}>
      <View style={styles.instructionsContainer}>
        <Text style={[appStyles.insetHeader, styles.instructionsHeader]}>Playing Posele:</Text>
        <Text style={[appStyles.text, appStyles.insetText, styles.instructionsText]}>
          1. Tap 'Pose Now!' to play.
        </Text>
        <Text style={[appStyles.text, appStyles.insetText, styles.instructionsText]}>
          2. You have 3 seconds to view today's pose.
        </Text>
        <Text style={[appStyles.text, appStyles.insetText, styles.instructionsText]}>
          3. Then you have 5 seconds to match the pose.
        </Text>
        <Text style={[appStyles.text, appStyles.insetText, styles.instructionsText]}>
          4. Make sure to fit your entire body.
        </Text>
        <Text style={[appStyles.text, appStyles.insetText, styles.instructionsText]}>
          5. Our ML model will predict your pose match.
        </Text>
        <Text style={[appStyles.text, appStyles.insetHeader]}>Good luck!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/cameraWarning.jpg')}></Image>
        <Image style={styles.image} source={require('../assets/movement.png')}></Image>
      </View>
      <Text style={[appStyles.warningText, styles.warning]}>
        Please move to a location where you have room to move around and permission to take
        pictures. Be aware of other people, pets, and objects.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.button, styles.smallButton]}
          onPress={() => navigation.replace('MyTabs')}
        >
          <Text style={[appStyles.secondaryButtonText, styles.buttonText]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.bigButton]}
          onPress={() => navigation.replace('DisplayPose')}
        >
          <Text style={[appStyles.secondaryButtonText, styles.buttonText]}>Pose Now!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  instructionsContainer: {
    flex: 2,
    borderRadius: 5,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    marginTop: 65,
  },
  imageContainer: {
    backgroundColor: colors.primary,
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
  },
  warning: {
    textAlign: 'center',
    width: '85%',
    fontSize: 20,
    margin: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: '35%',
    height: '100%',
    margin: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bigButton: {
    width: '60%',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  smallButton: {
    width: '25%',
  },
});
