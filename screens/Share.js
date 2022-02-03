import React, {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, appStyles} from '../colorConstants';

export default function Share() {
  return (
    <View styles={appStyles.mainView}>
      <Text style={appStyles.Text}>WHAT UP FAM</Text>
    </View>
  );
}
