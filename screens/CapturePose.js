import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default () => {
	const cameraRef = useRef();

	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.front);
	const [cameraIsReady, setCameraIsReady] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
			const response = await MediaLibrary.requestPermissionsAsync();
			console.log("🧑🏻‍💻 response", response);
		})();
	}, []);

	const handleCapture = async () => {
		if (!cameraIsReady) console.log("🧑🏻‍💻 Camera is not ready!");
		else {
			const imageData = await cameraRef.current.takePictureAsync({
				base64: true,
			});
			console.log("🧑🏻‍💻 image", imageData);
			// await MediaLibrary.saveToLibraryAsync(imageData.uri);
		}
	};

	if (hasPermission === null) return <View />;
	if (hasPermission === false) return <Text>No access to camera</Text>;
	return (
		<View style={styles.container}>
			<Camera
				ref={cameraRef}
				style={styles.camera}
				type={type}
				autoFocus={true}
				onCameraReady={() => {
					setCameraIsReady(true);
				}}
			></Camera>
			<Pressable
				onPress={() => handleCapture()}
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? "gray" : "white",
					},
					styles.captureButton,
				]}
			></Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		width: "100%",
		height: "100%",
	},
	captureButton: {
		position: "absolute",
		left: Dimensions.get("screen").width / 2 - 50,
		bottom: 40,
		width: 100,
		zIndex: 100,
		height: 100,
		borderRadius: 50,
	},
});
