import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default ({route}) => {
  const navigation = useNavigation();

  const imageUri = route.params.image.uri;

  const handleReady = () => {
    navigation.replace('CapturePose');
  };

  return (
    <View style={styles.container}>
      <View style={(styles.container, {height: 100})}></View>
      <View style={styles.imageContainer}>
        <Text style={styles.header}>Match the Pose:</Text>
        <Image style={styles.image} source={{uri: imageUri}}></Image>
      </View>
      <View style={styles.container}>
        <Text style={styles.warning}>Remember to Pose Responsibly!</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={handleReady}>
            Pose Now!
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 20,
    width: '90%',
    backgroundColor: '#414BB2CC',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '90%',
    resizeMode: 'contain',
  },
  warning: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#414BB2',
    width: '85%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});