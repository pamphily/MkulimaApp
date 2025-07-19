import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const BOT_ID = 6062;
const SARUFI_API_KEY = 'eee785909d281f837418de3da1dac0216e550f028e4e65b795d1ea044297725d';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('chat_messages').then(saved => {
      if (saved) setMessages(JSON.parse(saved));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    Keyboard.dismiss();
    setTyping(true);

    try {
      const userId = await AsyncStorage.getItem('user_id') || 'default-user';

      const response = await fetch('https://api.sarufi.io/api/v1/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SARUFI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: BOT_ID,
          user_id: userId,
          message: input,
        }),
      });

      const data = await response.json();

      const botText = Array.isArray(data.message)
        ? data.message.join(' ')
        : data.message || 'Samahani, siwezi kujibu sasa hivi.';

      setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Hitilafu. Jaribu tena.' }]);
    } finally {
      setTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.bubble, item.sender === 'user' ? styles.user : styles.bot]}>
      <Text style={[styles.text, item.sender === 'user' ? styles.userText : styles.botText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/default-avatar.png')} style={styles.avatar} />
        <Text style={styles.headerText}>Mkulima AI</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
        renderItem={renderMessage}
      />

      {/* Typing Indicator */}
      {typing && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#19551B" />
          <Text style={styles.typingText}> Mkulima AI is typing...</Text>
        </View>
      )}

      {/* Input Box */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Andika ujumbe..."
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendBtnText}>Tuma</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f7e9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomColor: '#19551B',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19551B',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  bubble: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#19551B',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#19551B',
    borderWidth: 1,
  },
  text: { fontSize: 16 },
  userText: { color: '#fff' },
  botText: { color: '#19551B' },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  typingText: {
    color: '#19551B',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#f1f7e9',
    paddingBottom: Platform.OS === 'android' ? 60 : 32,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    maxHeight: 140,
  },
  sendBtn: {
    backgroundColor: '#19551B',
    borderRadius: 20,
    padding: 12,
    marginLeft: 8,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
