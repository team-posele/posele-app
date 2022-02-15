import {
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
  const navigate = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate.replace('MyTabs');
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

  return (
    <KeyboardAvoidingView
      style={styles.mainView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.screenTitleContainer}>
        <Text style={appStyles.heading1}>Create Account</Text>
      </View>
      <View style={styles.inputContainer}>
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
      </View>
      {/* <View style={styles.buttonContainer}> */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
        <Text style={appStyles.secondaryButtonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          navigate.replace('SignIn');
        }}
      >
        <Text style={appStyles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          navigate.replace('MyTabsGuest');
        }}
      >
        <Text style={appStyles.primaryButtonText}>Play as Guest</Text>
      </TouchableOpacity>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  screenTitleContainer: {
    flex: 5,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flex: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  input: {
    backgroundColor: '#414BB222',
    borderWidth: 1,
    borderColor: colors.primary,
    color: 'black',
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
  warningText: {
    color: 'red',
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 100,
    justifyContent: 'center',
    marginHorizontal: 15,
    padding: 20,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    marginHorizontal: 15,
    padding: 10,
  },
});
