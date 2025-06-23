import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import zxcvbn from 'zxcvbn';
import { Picker } from '@react-native-picker/picker';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

type RegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
};

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // NEW

  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (password.length > 0) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!role) newErrors.role = 'Please select your role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch('http://172.23.16.1:5000/user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phoneNumber,
          password,
          role,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.status === 'error') {
        Alert.alert('Error', data.message);
      } else if (data.status === 'success') {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Login');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderPasswordStrength = () => {
    if (!password) return null;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#34c759'];

    return (
      <View style={styles.strengthContainer}>
        <Text style={styles.strengthText}>
          Strength: <Text style={{ color: colors[passwordStrength] }}>{labels[passwordStrength]}</Text>
        </Text>
        <View style={styles.strengthBarContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.strengthBar,
                i <= passwordStrength + 1 && { backgroundColor: colors[passwordStrength] },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logo/splash-icon.png')} style={styles.logo} />
          </View>

          <View style={styles.textHeader}>
            <Text style={styles.header}>MkulimaApp - Registration</Text>
            <Text style={styles.subHeader}>Fill in your details to register</Text>
          </View>

          <View style={styles.inputContainer}>
            {/* Name */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account" size={20} color="#19551B" style={styles.icon} />
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            {/* Email */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email" size={20} color="#19551B" style={styles.icon} />
              <TextInput
                ref={emailInputRef}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => phoneInputRef.current?.focus()}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Phone Number */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="phone" size={20} color="#19551B" style={styles.icon} />
              <TextInput
                ref={phoneInputRef}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            </View>
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            {/* Role Picker */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account-check" size={20} color="#19551B" style={styles.icon} />
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Role" value="" enabled={false} />
                <Picker.Item label="Regular" value="regular" />
                <Picker.Item label="Expert" value="expert" />
              </Picker>
            </View>
            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

            {/* Password */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock" size={20} color="#19551B" style={styles.icon} />
              <TextInput
                ref={passwordInputRef}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            {renderPasswordStrength()}

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-check" size={20} color="#19551B" style={styles.icon} />
              <TextInput
                ref={confirmPasswordInputRef}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Register Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>Register Now</Text>}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!keyboardVisible && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>By registering, you agree to our Terms and Privacy Policy</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FBF1' },
  keyboardAvoid: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 100, height: 100, resizeMode: 'contain' },
  textHeader: { alignItems: 'center', marginBottom: 30 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subHeader: { fontSize: 16, color: '#666', textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#19551B',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  errorText: { color: '#ff3b30', fontSize: 14, marginBottom: 10, marginLeft: 10 },
  strengthContainer: { marginBottom: 15, marginTop: 5 },
  strengthText: { fontSize: 14, color: '#666', marginBottom: 5 },
  strengthBarContainer: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  strengthBar: { flex: 1, height: 5, marginHorizontal: 1 },
  buttonContainer: { marginTop: 10 },
  registerButton: {
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
  disabledButton: { backgroundColor: '#a9a9a9' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: { color: '#666', fontSize: 15 },
  loginLink: { color: '#19551B', fontSize: 15, fontWeight: 'bold' },
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { color: '#999', fontSize: 12, textAlign: 'center' },
});
