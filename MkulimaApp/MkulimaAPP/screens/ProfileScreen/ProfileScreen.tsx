import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';

type UserType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
};

const ProfileScreen = () => {
  const { authData } = useContext(AuthContext);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authData?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://172.20.10.2:5000/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });

        const data = await response.json();
        console.log('Profile response:', data);

        if (response.ok && data.status === 'success') {
          setUser(data.user);
        } else {
          Alert.alert('Profile Error', data.message || 'Could not fetch profile');
        }
      } catch (error) {
        console.error('Network error:', error);
        Alert.alert('Network Error', 'Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authData?.token]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1BB582" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Failed to load profile data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        <Image
          source={
            avatarUri
              ? { uri: avatarUri }
              : require('../../assets/default-avatar.png')
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user.phone}</Text>

        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user.role || 'N/A'}</Text>

        <Text style={styles.label}>Joined:</Text>
        <Text style={styles.value}>
          {new Date(user.createdAt).toLocaleDateString()}
        </Text>
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
    width: '85%',
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
