import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

import {auth} from '../firebase';
import {colors, appStyles} from '../colorConstants';
// import {updateUser} from '../firebase/firestore';

const Login = () => {
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

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(`Logging in with user email: ${user.email}`);
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
      <View style={appStyles.screenTitleContainer}>
        <Text style={appStyles.heading1}>Sign In</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={[appStyles.warningText, {width: '85%'}]}>{errorText}</Text>
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
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.primaryButton]}
          onPress={handleLogin}
        >
          <Text style={appStyles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[appStyles.primaryButton, styles.secondaryButton]}
          onPress={() => {
            navigate.replace('SignUp');
          }}
        >
          <Text style={appStyles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '85%',
  },
  buttonContainer: {
    // width: '100%',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'flex-end',
    // marginBottom: Platform.OS === 'ios' ? 30 : 15,
    position: 'absolute',
    left: 35,
    bottom: 0,
    right: 0,
  },
  primaryButton: {
    width: '85%',
    marginBottom: 100,
    paddingBottom: 5,
  },
  secondaryButton: {
    width: '85%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  inputContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '85%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
  primaryButtonText: {
    paddingBottom: 10,
  },
});
