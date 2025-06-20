  import React, { useState, useContext, useRef, useEffect } from 'react';
  import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    Alert, 
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    ActivityIndicator
  } from 'react-native';
  import { StackNavigationProp } from '@react-navigation/stack';
  import { AuthContext } from '../../context/AuthProvider';
  import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
  import axios from 'axios';
  import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';

  type RootStackParamList = {
    Login: undefined;
    Password: undefined;
    Home: undefined;
    Register: undefined ;
  };

  type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
  };

  const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('admin');
    const [loading, setLoading] = useState(false);
    const passwordInputRef = useRef<TextInput>(null);

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const { setAuthData } = useContext(AuthContext);

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        (e) => {
          setKeyboardVisible(true);
          // Scroll to bottom when keyboard appears
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      );
      
      const keyboardDidHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          setKeyboardVisible(false);
        }
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
    
      setLoading(true);
    
      // 🛡️ Fallback for Admin Quick Login
      if (email === 'admin@gmail.com' && password === 'admin') {
        console.log("Hit login")
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJzLWVlZDcwMmEwLTMxNmMtNDhlOC1hMDQ4LTZjZmRiYzIzYWI1OCIsInBob25lIjoiMCIsImlhdCI6MTc0OTUzODI5MSwiZXhwIjoxNzQ5NTQxODkxfQ.2o1QhkJ-vp0twmPjTIShgXqQOuXK-obcq2ky6Rk0SUo";
        setAuthData({ token });
        setLoading(false);
        navigation.replace('Home');
        return;
      }
    
      // try {
      //   const response = await fetch('http://localhost:5000/user/login', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ email, password }),
      //   });
    
      //   const data = await response.json();
    
      //   if (data.status === "error") {
      //     console.error('Login error:', data.error);
      //     Alert.alert('Error', data.error || 'Login failed. Please check your credentials.');
      //     setLoading(false);
      //     return;
      //   }
    
      //   const { token } = data;
      //   setAuthData({ token });
      //   navigation.navigate('Home');
      // } catch (error) {
      //   console.error('Network error:', error);
      //   Alert.alert('Error', 'Network error. Please try again later.');
      // } finally {
      //   setLoading(false);
      // }
    };


    return (
      <SafeAreaProvider>
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logo/splash-icon.png')} 
                style={styles.logo} 
              />
            </View>

            <View style={styles.textHeader}>
              <Text style={styles.header}>Welcome Back</Text>
              <Text style={styles.subHeader}>Sign in to Continue</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons 
                  name="email" 
                  size={20} 
                  color="#19551B" 
                  style={styles.icon} 
                />
                <TextInput
                  onChangeText={setEmail}
                  value={email}
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="Enter Your Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              </View>

              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons 
                  name="lock" 
                  size={20} 
                  color="#19551B" 
                  style={styles.icon} 
                />
                <TextInput
                  onChangeText={setPassword}
                  value={password}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="go"
                  ref={passwordInputRef}
                  onSubmitEditing={handleLogin}
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Password')}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {!keyboardVisible && (
              <View style={styles.footer}>
                <Text style={styles.footerText}>© 2025 Lakwetu. All rights reserved</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </SafeAreaProvider>
    
    );
  }

  export default LoginScreen;

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F7FBF1',
    },
    keyboardAvoid: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
    },
    textHeader: {
      alignItems: 'center',
      marginBottom: 30,
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    subHeader: {
      fontSize: 16,
      color: '#666',
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
  borderBottomWidth: 1,
  borderBottomColor: '#19551B',
  paddingVertical: 8,
  paddingHorizontal: 5,
},
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: '#333',
    },
    forgotPasswordButton: {
      alignSelf: 'flex-end',
      marginTop: 5,
    },
    forgotPasswordText: {
      color: '#19551B',
      fontSize: 14,
      fontWeight: '500',
    },
    buttonContainer: {
      marginTop: 10,
    },
    loginButton: {
      backgroundColor: '#19551B',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    registerText: {
      color: '#666',
      fontSize: 15,
    },
    registerLink: {
      color: '#19551B',
      fontSize: 15,
      fontWeight: 'bold',
    },
    footer: {
      marginTop: 30,
      alignItems: 'center',
    },
    footerText: {
      color: '#999',
      fontSize: 12,
    },
  });