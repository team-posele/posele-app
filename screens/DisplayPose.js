import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Image, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Pose() {
  const navigation = useNavigation();

  const handleReady = () => {
    navigation.replace('CapturePose');
  };

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <View style={styles.pose}>
        <Image
          style={styles.image}
          source={{
            uri:
              'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/05/Storm-Toys-Michael-Jordan-Figures-.jpg',
          }}
        ></Image>
        <Text style={styles.warning}>Warning Text</Text>
        <Button onPress={handleReady} title="Ready" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  pose: {},
  warning: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
    marginBottom: 60,
  },
  image: {
    resizeMode: 'contain',
    width: 300,
    height: 300,
    paddingTop: 40,
  },
});
