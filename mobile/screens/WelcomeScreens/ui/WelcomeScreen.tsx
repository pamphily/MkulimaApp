import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';


 type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Splash: undefined ;
    Register: undefined;
  };

  type WelcomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Welcome'>;
  };


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {


  // Check if user has already seen the get started screen
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('@hasLaunchedBefore');
        if (value !== null) {
          // User has launched before, navigate to appropriate screen
          navigation.replace('Login');
        }
      } catch (e) {
        console.error('Error reading async storage:', e);
      }
    };

    checkFirstLaunch();
  }, []);

  const handleGetStarted = async () => {
    try {
      // Mark that the user has seen the get started screen
      await AsyncStorage.setItem('@hasLaunchedBefore', 'true');
      navigation.navigate('Register');
    } catch (e) {
      console.error('Error saving to async storage:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        // colors={['#8B0000', '#A52A2A']}
        style={styles.background}
      >
        <View style={styles.content}>
          <Image
            source={require('../../../assets/logo/splash-icon.png')}
            style={styles.logo}
          />
          
          <Text style={styles.title}>Welcome to Mkulima's Table App</Text>
          
          <Text style={styles.subtitle}>
            The best way to manage your education, forum discussions, and more
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7FBF1',
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#19551B',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#19551B',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;