import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE from '../../api/api';
import { useNavigation } from '@react-navigation/native';

interface User {
  id: number;
  name: string;
  role?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

const ChatListScreen = () => {
  const [recentChats, setRecentChats] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const navigation = useNavigation<any>();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId !== null) {
      fetchRecentChats();
      fetchAllUsers();
    }
  }, [currentUserId]);

  const getCurrentUserId = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUserId(parsed.id);
    }
  };

  const fetchRecentChats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/recent/${currentUserId}`);
      const data = await response.json();
      const sorted = data.sort((a: any, b: any) =>
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      setRecentChats(sorted);
    } catch (error) {
      console.error('Tatizo la kupakua gumzo:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/user`);
      const data = await response.json();
      const filtered = data.filter((u: User) => u.id !== currentUserId);
      setAllUsers(filtered);
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Tatizo la kupakua watumiaji:', error);
    }
  };

  const filterUsers = (text: string) => {
    setSearchQuery(text);
    const lower = text.toLowerCase();
    const filtered = allUsers.filter(
      (user) => user.name?.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (user: User) => {
    setModalVisible(false);
    navigation.navigate('ChatScreen', { user });
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderUserCard = (user: User) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleUserSelect(user)}>
      <Image
        source={require('../../assets/default-avatar.png')}
        style={styles.avatar}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.userName}>{user.name}</Text>
        {user.role === 'expert' && <Text style={styles.tag}>Mtaalamu</Text>}
        {user.lastMessage && (
          <Text style={styles.preview}>{user.lastMessage}</Text>
        )}
      </View>
      {user.lastMessageTime && (
        <Text style={styles.time}>{formatTime(user.lastMessageTime)}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mijadala ya Karibuni</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#19551B" />
      ) : (
        <FlatList
          data={recentChats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderUserCard(item)}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}

      {/* Floating + Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => {
          setModalVisible(true);
          setTimeout(() => inputRef.current?.focus(), 300);
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => {
          setModalVisible(false);
          Keyboard.dismiss();
        }}>
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>Anza Gumzo Jipya</Text>
            <View style={styles.searchRow}>
              <TextInput
                ref={inputRef}
                placeholder="Tafuta watumiaji..."
                value={searchQuery}
                onChangeText={filterUsers}
                style={styles.searchInput}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#19551B" />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.sectionTitle}>Wataalamu</Text>
              {filteredUsers.filter((u) => u.role === 'expert').map(renderUserCard)}
              <Text style={styles.sectionTitle}>Watumiaji wa Kawaida</Text>
              {filteredUsers.filter((u) => u.role !== 'expert').map(renderUserCard)}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f7e9',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#19551B',
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d4e5ce',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19551B',
  },
  tag: {
    fontSize: 13,
    color: '#1BB582',
  },
  preview: {
    fontSize: 13,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  plusButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    backgroundColor: '#19551B',
    borderRadius: 32,
    padding: 16,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#f1f7e9',
    borderRadius: 16,
    padding: 16,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19551B',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    color: '#19551B',
  },
});
