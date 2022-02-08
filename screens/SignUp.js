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
import firestore from '@react-native-firebase/firestore';
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
        updateUser(auth.currentUser.email);
      })
      .catch(error => {
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
        <Text style={appStyles.warningText}>{errorText}</Text>
        <Text style={[appStyles.text, styles.inputLabel]}>Enter a valid email address:</Text>

        <TextInput
          style={[appStyles.textInputBox, styles.input]}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Text style={[appStyles.text, styles.inputLabel]}>Create a password:</Text>
        <TextInput
          style={[appStyles.textInputBox, styles.input]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Text style={[appStyles.text, styles.inputLabel]}>
          Your username will be visible to others:
        </Text>
        <TextInput
          style={[appStyles.textInputBox, styles.input]}
          placeholder="Username"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={[appStyles.container, {flexDirection: 'row'}]}>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.secondaryButton]}
          onPress={() => {
            navigate.replace('Login');
          }}
        >
          <Text style={appStyles.secondaryButtonText}>{`<< Back to Login`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[appStyles.primaryButton, styles.primaryButton, appStyles.highlight]}
          onPress={handleSignUp}
        >
          <Text style={appStyles.primaryButtonText}>Create Account</Text>
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
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  primaryButton: {
    width: '65%',
    marginTop: 20,
  },
  secondaryButton: {
    width: '20%',
    alignItems: 'center',
    marginTop: 20,
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
