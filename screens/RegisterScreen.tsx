import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Farmer');

  const handleRegister = () => {
    // Replace with actual registration logic
    if (name && email && password) {
      navigation.navigate('QuickStart'); // Redirect to QuickStart after successful registration
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Splash-icon.png')} style={styles.logo} />
      <Text style={styles.title}>Register to Mkulima's Table</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.userTypeContainer}>
        <TouchableOpacity onPress={() => setUserType('Farmer')} style={[styles.userTypeButton, userType === 'Farmer' && styles.selected]}>
          <Text style={styles.userTypeText}>Farmer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setUserType('Expert')} style={[styles.userTypeButton, userType === 'Expert' && styles.selected]}>
          <Text style={styles.userTypeText}>Expert</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBF1',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#19551B',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#19551B',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userTypeButton: {
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#19551B',
    borderRadius: 5,
  },
  selected: {
    backgroundColor: '#19551B',
  },
  userTypeText: {
    color: '#19551B',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#19551B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#19551B',
    textAlign: 'center',
    marginTop: 10,
  },
});
