import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={(styles.container, {height: 100})}></View>
      <View style={styles.imageContainer}>
        <Text style={styles.header}>Got No Pose...</Text>
        <Image style={styles.image} source={require('../assets/no-pose.gif')}></Image>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => navigation.navigate('MyTabs')}>
            Back to Home
          </Text>
        </TouchableOpacity>
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
    marginBottom: 20,
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
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallButton: {
    width: '25%',
    backgroundColor: 'white',
    borderColor: '#414BB2',
    borderWidth: 1,
  },
  smallButtonText: {color: '#414BB2'},
});
