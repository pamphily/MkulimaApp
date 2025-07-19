import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import API_BASE from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';

interface Message {
  id?: number;
  sender_id: number;
  receiver_id: number;
  content?: string;
  image?: string;
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

      socket.emit('register', currentUserId);

      socket.on('receiveMessage', (msg: any) => {
        if (
          (msg.senderId === receiver.id && msg.receiverId === currentUserId) ||
          (msg.senderId === currentUserId && msg.receiverId === receiver.id)
        ) {
          const newMsg: Message = {
            sender_id: msg.senderId,
            receiver_id: msg.receiverId,
            content: msg.message,
            image: msg.image,
            created_at: msg.timestamp,
          };
          setMessages((prev) => [...prev, newMsg]);
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
      const res = await fetch(`${API_BASE}/api/chat/history/${currentUserId}/${receiver.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const sendMessage = async (imageData?: string) => {
    if (!messageText.trim() && !imageData) return;

    const message = {
      senderId: currentUserId!,
      receiverId: receiver.id,
      message: messageText.trim(),
      image: imageData || null,
    };

    try {
      await fetch(`${API_BASE}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      socket.emit('sendMessage', message);

      setMessages((prev) => [
        ...prev,
        {
          sender_id: currentUserId!,
          receiver_id: receiver.id,
          content: message.message,
          image: message.image || undefined,
          created_at: new Date().toISOString(),
        },
      ]);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      sendMessage(base64Image);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.sender_id === currentUserId;
    return (
      <View style={[styles.messageContainer, isOwn ? styles.sent : styles.received]}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.messageImage} />
        )}
        {item.content ? (
          <Text style={[styles.messageText, { color: isOwn ? '#fff' : '#000' }]}>
            {item.content}
          </Text>
        ) : null}
        <Text style={styles.timestamp}>{item.created_at?.slice(11, 16)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.avatarHeader}>
            <Image
              source={require('../../assets/default-avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.name}>{receiver.name}</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingBottom: 80 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 60}
            style={styles.inputContainer}
          >
            <TouchableOpacity onPress={pickImage}>
              <Ionicons name="image" size={28} color="#19551B" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Andika ujumbe wako..."
              placeholderTextColor="#777"
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f7e9',
  },
  avatarHeader: {
    alignItems: 'center',
    marginVertical: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19551B',
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
    fontSize: 15,
    marginTop: 4,
  },
  timestamp: {
    color: '#999',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  messageImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 6,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f1f7e9',
    color: '#000',
    fontSize: 16,
    height: Platform.OS === 'android' ? 60 : 48,
    marginHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#19551B',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
