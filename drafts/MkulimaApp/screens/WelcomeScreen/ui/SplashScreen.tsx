import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Animated } from 'react-native';
import Spinner from '../../../components/Spinner';
import { StackNavigationProp } from '@react-navigation/stack';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
};

type SplashScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      const netInfoSubscription = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
      });
      return () => {
        netInfoSubscription();
      };
    }, [])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the login screen if connected, otherwise show an error message
      if (isConnected) {
        navigation.replace('Welcome');
        console.log("conencted")
      } else {
        // Handle no network connection scenario here, you can show an error message or take other actions
        console.log('No network connection');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, isConnected]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.statusText}>
        {isConnected === null
          ? 'Checking network...'
          : isConnected
          ? 'Connected to Mkulimas Table'
          : 'No network connection'}
      </Text>
      {isConnected !== null && (
        <Animated.View style={styles.spinnerContainer}>
          <Spinner />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FBF1',
  },
  logo: {
    width: 150,
    height: 150,
  },
  statusText: {
    marginBottom: 10,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
