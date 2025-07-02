import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getUserData } from '../../services/UserService';
import API_BASE from '../../api/api';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authData = await getUserData();
        if (!authData?.token || !authData?.id) {
          Alert.alert('Authentication Error', 'User not logged in');
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setName(data.user.name);
          setPhone(data.user.phone);
        } else {
          Alert.alert('Error', 'Failed to load profile');
        }
      } catch (err) {
        Alert.alert('Error', 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'We need permission to access your media');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].base64);
    }
  };

  const handleUpdate = async () => {
    const authData = await getUserData();
    if (!authData?.token || !authData?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (newPassword && !currentPassword) {
      Alert.alert('Validation Error', 'Enter your current password to set a new one');
      return;
    }

    const payload = {
      name,
      phone,
      currentPassword,
      newPassword,
      avatar: avatarUri ? `data:image/jpeg;base64,${avatarUri}` : null,
    };

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}/user/${authData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        Alert.alert('Success', 'Profile updated');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const authData = await getUserData();
    if (!authData?.token || !authData?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE}/user/${authData.id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${authData.token}`,
                },
              });

              const data = await res.json();
              if (res.ok && data.status === 'success') {
                Alert.alert('Account Deleted', 'Your account has been successfully deleted');
                // Optional: navigate to login or home screen
              } else {
                Alert.alert('Error', data.message || 'Could not delete account');
              }
            } catch (err) {
              Alert.alert('Error', 'Network error');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#19551B" style={{ flex: 1 }} />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        <Image
          source={
            avatarUri
              ? { uri: `data:image/jpeg;base64,${avatarUri}` }
              : require('../../assets/default-avatar.png')
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Edit Profile</Text>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} />

        <Text style={styles.label}>Email (read-only)</Text>
        <TextInput
          value={user.email}
          editable={false}
          style={[styles.input, { backgroundColor: '#eee', color: 'gray' }]}
        />
      </View>

      <Text style={styles.sectionTitle}>Change Password</Text>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="Current Password"
          style={styles.input}
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="New Password"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={handleUpdate}
        disabled={updating}
        style={styles.updateButton}
      >
        <Text style={styles.updateButtonText}>
          {updating ? 'Updating...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Other Details</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Role:</Text>
        <Text style={styles.infoValue}>{user.role}</Text>

        <Text style={styles.infoLabel}>Joined:</Text>
        <Text style={styles.infoValue}>
          {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7FBF1',
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19551B',
    marginTop: 20,
    marginBottom: 10,

  },
  inputCard: {
    width: '90%',
    backgroundColor: '#f1f7e9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#19551B',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  updateButton: {
    backgroundColor: '#19551B',
    padding: 14,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#19551B',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
