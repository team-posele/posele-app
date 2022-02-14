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
      style={appStyles.mainView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[appStyles.screenTitleContainer, {marginTop: 10}]}>
        <Text style={appStyles.heading1}>Create Account</Text>
        <Text style={appStyles.heading2}>This will just take a moment.</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[appStyles.textInputBox, styles.input]}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={[appStyles.textInputBox, styles.input]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <TextInput
          style={[appStyles.textInputBox, styles.input]}
          placeholder="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={[appStyles.container, {flexDirection: 'row'}]}>
        <Text style={appStyles.warningText}>{errorText}</Text>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.primaryButton]}
          onPress={handleSignUp}
        >
          <Text style={appStyles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[appStyles.primaryButtonText, appStyles.primaryButton, styles.secondaryButton]}
          onPress={() => {
            navigate.replace('SignIn');
          }}
        >
          <Text style={appStyles.primaryButtonText}>SignIn</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  inputLabel: {
    color: colors.primary,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  primaryButton: {
    width: '65%',
    marginTop: 70,
  },
  secondaryButton: {
    width: '65%',
    alignItems: 'center',
  },

  inputContainer: {
    flex: 1,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
});
