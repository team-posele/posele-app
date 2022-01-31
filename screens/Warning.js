import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function Warning() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.instructionsView}>
        <Text style={[styles.instructionsText, { textAlign: "center" }]}>
          Playing Posele:
        </Text>
        <Text style={styles.instructionsText}>
          1. When you click Pose Now, you will see an image
        </Text>
        <Text style={styles.instructionsText}>
          2. Your device camera will start
        </Text>
        <Text style={styles.instructionsText}>
          3. You have five seconds to line up your shot and match the pose in
          the image.
        </Text>
        <Text style={styles.instructionsText}>Good luck! </Text>
      </View>
      <View style={styles.pose}>
        <Image
          style={styles.image}
          source={require("../assets/cameraWarning.jpg")}
        ></Image>
        <Text style={styles.warning}>
          Please move to a location where you have room to move around and
          permission to take pictures. Be aware of other people, pets, and
          objects.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.smallButton]}>
          <Text
            style={[styles.buttonText, styles.smallButtonText]}
            onPress={() => navigation.replace("MyTabs")}
          >
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => navigation.replace("DisplayPose")}
          >
            Pose Now!
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionsView: {
    flex: 2,
    marginTop: 30,
    alignContent: "center",
    justifyContent: "flex-end",
    marginHorizontal: 10,
  },
  instructionsText: {
    backgroundColor: "#414BB2",
    color: "white",
    fontSize: 20,
    padding: 10,
  },
  pose: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  warning: {
    color: "red",
    textAlign: "center",
    width: "50%",
    fontSize: 20,
    margin: 5,
  },
  image: {
    resizeMode: "contain",
    width: "35%",
    margin: 5,
  },
  button: {
    backgroundColor: "#414BB2",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  smallButton: {
    width: "25%",
    backgroundColor: "white",
    borderColor: "#414BB2",
    borderWidth: 1,
  },
  smallButtonText: { color: "#414BB2" },
});
