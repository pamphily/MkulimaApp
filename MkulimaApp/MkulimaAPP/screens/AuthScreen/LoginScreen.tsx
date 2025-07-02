import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthContext } from '../../context/AuthProvider';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import API_BASE from '../../api/api';

type RootStackParamList = {
  Login: undefined;
  Password: undefined;
  Home: undefined;
  Register: undefined;
};

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { setAuthData } = useContext(AuthContext);

  useEffect(() => {
    const keyboardShow = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(keyboardShow, () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    const hideSub = Keyboard.addListener(keyboardHide, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    if (email === 'admin@gmail.com' && password === 'admin') {
      const token = "admin_token_mock";
      setAuthData({ token });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      const { token } = data;
      setAuthData({ token });
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await fetch(`${API_BASE}/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (!response.ok || data.status === 'error') {
        Alert.alert('Failed', data.error || 'Unable to process request');
      } else {
        Alert.alert('Success', 'Password reset instructions sent to your email.');
        setForgotModalVisible(false);
        setForgotEmail('');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error while processing request.');
    } finally {
      setForgotLoading(false);
    }
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
                  placeholderTextColor="#999"
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
                onPress={() => setForgotModalVisible(true)}
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

          {/* Forgot Password Modal */}
          <Modal visible={forgotModalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <Text style={styles.modalSubtitle}>
                  Enter your email to receive password reset instructions.
                </Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.modalButtonGroup}>
                  <TouchableOpacity
                    style={[styles.loginButton, { flex: 1, marginRight: 5 }]}
                    onPress={handleForgotPassword}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.loginButton, { flex: 1, backgroundColor: '#ccc' }]}
                    onPress={() => setForgotModalVisible(false)}
                  >
                    <Text style={[styles.buttonText, { color: '#000' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

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
    elevation: 5,
  },
  buttonText: {
    color: '#f1f7e9',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#333',
  },
  registerLink: {
    fontSize: 16,
    color: '#19551B',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#19551B',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 50,
    borderColor: '#19551B',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
