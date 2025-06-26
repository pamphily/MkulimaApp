import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import API_BASE from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';

interface Message {
  id?: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at?: string;
}

type ChatScreenRouteProp = RouteProp<{ ChatScreen: { user: any } }, 'ChatScreen'>;

const socket = io(API_BASE);

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { user: receiver } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchChatHistory();

      socket.on('receiveMessage', (message: Message) => {
        if (
          (message.sender_id === receiver.id && message.receiver_id === currentUserId) ||
          (message.sender_id === currentUserId && message.receiver_id === receiver.id)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [currentUserId]);

  const getCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUserId(parsed.id);
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/history/${currentUserId}/${receiver.id}`
      );
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    const message: Message = {
      sender_id: currentUserId!,
      receiver_id: receiver.id,
      content: messageText.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      const saved = await res.json();

      socket.emit('sendMessage', saved);
      setMessages((prev) => [...prev, saved]);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.sender_id === currentUserId;
    return (
      <View style={[styles.messageContainer, isOwn ? styles.sent : styles.received]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{item.created_at?.slice(11, 16)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Chat with {receiver.name}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#777"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f7e9',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#19551B',
    marginBottom: 10,
    alignSelf: 'center',
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 10,
  },
  sent: {
    backgroundColor: '#19551B',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#dbead0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  timestamp: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f1f7e9',
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#19551B',
    borderRadius: 25,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
