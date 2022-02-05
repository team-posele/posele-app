import React, {useState, useEffect, useRef, useCallback} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Switch,
  Linking,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, appStyles} from '../colorConstants';
import {Icon} from 'react-native-elements';

export default function Share({route}) {
  const navigation = useNavigation();
  const imageUri = route.params?.imageUri;
  // console.log(imageUri);
  // grab the imageUri if passed in, avoid errors if it isn't

  // set state for tweet content (text)
  const [tweetContent, setTweetContent] = useState(
    `I matched today's posele! Think you can, too? Check out the posele app now to find out! #posele`
  );

  // set state for switch to include photo or not
  const [includePhotoSwitch, toggleIncludePhotoSwitch] = useState(true);

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
      <View style={[appStyles.container]}>
        {/* <SNSPicker /> */}
        <Text>SNS Picker Goes here</Text>
      </View>
      <View style={styles.postWrapper}>
        <View style={appStyles.container}>
          <View
            style={[
              appStyles.rowContainer,
              {
                flex: 0.2,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              },
            ]}
          >
            <Icon style={styles.icon} name={'autorenew'} size={26} color={'gray'} />
            <Text style={appStyles.heading2}>Compose your Tweet:</Text>
          </View>
          <View style={[appStyles.container, styles.composeBox]}>
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
        </View>
        <View style={styles.photoIncludeBox}>
          <View style={appStyles.container}>
            <Image
              style={[appStyles.image, {opacity: includePhotoSwitch ? 100 : 0}, styles.thumbnail]}
              source={imageUri ? {uri: imageUri} : require('../assets/photo.jpg')}
            />
          </View>
          <View style={appStyles.container}>
            <View style={appStyles.container}>
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
            <View style={appStyles.container}>
              <TouchableOpacity
                style={[appStyles.primaryButton, styles.primaryButton]}
                onPress={tweet}
              >
                <Text style={appStyles.primaryButtonText}>Tweet This</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={appStyles.container}>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.secondaryButton]}
          onPress={() => {
            navigation.replace('Results');
          }}
        >
          <Text style={appStyles.secondaryButtonText}>Back to Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.secondaryButton]}
          onPress={tweet}
        >
          <Text style={appStyles.secondaryButtonText}>Posele home</Text>
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
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'monospace',
  },
  primaryButton: {justifyContent: 'center'},
  secondaryButton: {
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  photoIncludeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composeBox: {
    flex: 1,
    width: '95%',
  },

  pickerModal: {
    width: '50%',
    backgroundColor: 'gray',
  },
  icon: {
    marginHorizontal: 20,
  },
  // buttonContainer: {
  //   flex: 1,
  //   marginVertical: 20,
  //   alignItems: 'center',
  //   justifyContent: 'space-evenly',
  // },
  thumbnail: {
    maxWidth: 150,
    maxHeight: 150,
  },
  postWrapper: {
    width: '90%',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
});

function SNSPicker(props) {
  return (
    <Modal style={styles.pickerModal}>
      <FlatList
        data={[
          {key: 1, title: 'twitter'},
          {key: 2, title: 'instagram'},
        ]}
        renderItem={({item}) => {
          return (
            <Text
            // item={item}
            // onPress={() => setSelectedId(item.id)}
            // backgroundColor={`#ffff${item.key * 3}${item.key * 3}`}
            // textColor={{color}}
            >
              hey what up
            </Text>
          );
        }}
      />
    </Modal>
  );
}
