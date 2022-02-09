import React, {useState, useEffect, useRef, useCallback} from 'react';
// import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  // ImageBackground,
  TouchableOpacity,
  // ActivityIndicator,
  TextInput,
  Switch,
  Linking,
} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import {colors, appStyles} from '../colorConstants';

export default function Share({route}) {
  const imageUri = route.params?.imageUri;
  // console.log(imageUri);
  // grab the imageUri if passed in, avoid errors if it isn't

  // set state for tweet content (text)
  const [tweetContent, setTweetContent] = useState(
    `I matched today's posele! Think you can, too? Check out the posele app now to find out! #posele`
  );

  // set state for switch to include photo or not
  const [includePhotoSwitch, toggleIncludePhotoSwitch] = useState(true);

  const thumbnailImage = useRef(null);
  // useEffect(() => {
  //   if (!includePhotoSwitch) styles.thumbnail.tintColor = '#ffffff';
  // }, [includePhotoSwitch]);
  let url;
  const tweet = useCallback(async () => {
    url = `https://twitter.com/share?ref_src=twsrc%5Etfw&text=I matched today's posele! Give it a try on your phone at www.posele.com!&url=www.posele.com`;
    // Checking if the link is supported for links with custom URL scheme.
    console.log(`hey what up, you tweetin: ${tweetContent}`);
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <View style={appStyles.mainView}>
      <View style={appStyles.screenTitleContainer}>
        <Text style={appStyles.heading1}>Share Your Pose!</Text>
      </View>
      <View style={appStyles.container}>
        <Image
          style={appStyles.image}
          // ref={thumbnailImage}
          source={imageUri ? {uri: imageUri} : require('../assets/photo.jpg')}
        />
      </View>
      <View style={appStyles.container}>
        <Text style={appStyles.heading2}>Compose your Tweet:</Text>
        <TextInput
          editable
          multiline
          numberOfLines={5}
          maxLength={250}
          value={tweetContent}
          onChangeText={text => setTweetContent(text)}
          style={[appStyles.textInputBox, styles.tweetContent]}
        ></TextInput>
      </View>
      <View style={appStyles.container}>
        <View style={styles.photoIncludeBox}>
          <Switch
            trackColor={{false: '#767577', true: colors.input}}
            thumbColor={includePhotoSwitch ? colors.primary : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleIncludePhotoSwitch(!includePhotoSwitch)}
            value={includePhotoSwitch}
            // style={{flex: 1}}
          />
          <Text style={appStyles.text}>include photo</Text>
        </View>
      </View>
      <View style={appStyles.container}>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.secondaryButton]}
          onPress={tweet}
        >
          <Text style={appStyles.secondaryButtonText}>Tweet This</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tweetContent: {
    fontSize: 20,
    padding: 10,
    margin: 5,
    fontStyle: 'italic',
  },
  photoIncludeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
