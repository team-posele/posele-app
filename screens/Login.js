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

const Login = () => {
  const navigate = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate.replace('MyTabs');
      }
    });

    return unsubscribe;
  }, []);

  const handleSignup = async () => {
    console.log(`you signed up`);
    auth
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

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(`Logging in with user email: ${user.email}`);
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
      <View style={styles.headerContainer}>
        <Text style={appStyles.heading1}>Welcome to Posele!</Text>
        <Text style={appStyles.heading2}>Please log in or create an account to get posing.</Text>
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
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[appStyles.primaryButton, styles.primaryButton, appStyles.highlight]}
          onPress={handleLogin}
        >
          <Text style={appStyles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[appStyles.secondaryButton, styles.secondaryButton]}
          onPress={handleSignup}
        >
          <Text style={appStyles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[appStyles.secondaryButton, styles.secondaryButton]}>
          <Text style={appStyles.secondaryButtonText}>Play as Guest (coming soon)</Text>
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
    width: '100%',
    flex: 1,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  primaryButton: {
    width: '85%',
    marginTop: 20,
  },
  secondaryButton: {
    width: '85%',
    alignItems: 'center',
    marginTop: 20,
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
});
