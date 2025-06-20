import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash-icon.png')} // replace with real image or avatar logic
        style={styles.avatar}
      />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>john@example.com</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>Expert Farmer</Text>

        <Text style={styles.label}>Joined:</Text>
        <Text style={styles.value}>March 2024</Text>

        {/* Add more fields here as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBF1',
    alignItems: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#1BB582',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  infoContainer: {
    marginTop: 30,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
