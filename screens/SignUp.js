import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  LogBox,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

import {auth} from '../firebase';
import {colors, appStyles} from '../colorConstants';
import {updateUser} from '../firebase/firestore';

LogBox.ignoreLogs(['AsyncStorage', 'Platform browser']); // hide unnecessary warnings

const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('MyTabs');
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
    console.log(`Signup Initiated...`);
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(`Signing up with user email: ${user.email}`);
        updateUser(auth.currentUser.email, username);
      })
      .catch(error => {
        setErrorText(`${error}`);
        console.log(`error! ${error}`);
      });
  };

  const handleBack = () => {
    navigation.replace('LandingScreen');
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.back}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.mainView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.screenTitleContainer}>
          <Text style={appStyles.heading1}>Create Account</Text>
        </View>
        <Image style={styles.image} source={require('../assets/sammy-telephone-2.png')}></Image>
        {/* <View style={styles.inputContainer}> */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <Text style={styles.warningText}>{errorText}</Text>
        {/* </View> */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
          <Text style={appStyles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            navigation.replace('SignIn');
          }}
        >
          <Text style={appStyles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, {marginBottom: 20}]}
          onPress={() => {
            navigation.replace('MyTabsGuest');
          }}
        >
          <Text style={appStyles.primaryButtonText}>Play as Guest</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  back: {
    marginLeft: 25,
    marginTop: 50,
    textAlign: 'left',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderRadius: 100,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    padding: 5,
  },
  backButtonText: {
    fontWeight: 'bold',
  },
  screenTitleContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  image: {
    flex: 8,
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#414BB222',
    borderWidth: 1,
    borderColor: colors.primary,
    color: 'black',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  warningText: {
    textAlign: 'center',
    color: 'red',
    paddingBottom: 10,
  },
  primaryButton: {
    // flex: 1,
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 100,
    justifyContent: 'center',
    marginHorizontal: 15,
    padding: 20,
  },
  secondaryButton: {
    // flex: 1,
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    marginHorizontal: 15,
    padding: 10,
  },
});
