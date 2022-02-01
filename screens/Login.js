import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {auth} from '../firebase';
import {useNavigation} from '@react-navigation/native';

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

  const handleSignup = () => {
    console.log(`you signed up`);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(`Signing up with user email: ${user.email}`);
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
    <KeyboardAvoidingView style={styles.main} behavior="padding">
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Log in to your posele account</Text>
      </View>

      {/* behavior: padding makes the view get out of the way of the device keyboard*/}
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
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText} onPress={handleLogin}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText} onPress={handleSignup}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Play as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerText: {fontSize: 24, textAlign: 'center'},
  buttonContainer: {
    width: '100%',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  primaryButton: {
    backgroundColor: '#414BB2',
    width: '85%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderColor: '#414BB2',
    borderWidth: 3,
    width: '85%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButtonText: {
    color: '#414BB2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '85%',
    backgroundColor: '#414BB222',
    borderWidth: 1,
    borderColor: '#414BB2',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});
