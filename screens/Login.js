import {
  Image,
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
      style={styles.mainView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.screenTitleContainer}>
        <Text style={appStyles.heading1}>Sign In</Text>
      </View>
      <Image
        style={styles.image}
        source={require('../assets/sammy-big-mobile-phone-with-lock.png')}
      ></Image>
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
      <Text style={styles.warningText}>{errorText}</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={appStyles.secondaryButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.secondaryButton, {marginBottom: 30}]}
        onPress={() => {
          navigate.replace('SignUp');
        }}
      >
        <Text style={appStyles.primaryButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  screenTitleContainer: {
    flex: 3,
    justifyContent: 'center',
    marginTop: 30,
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
