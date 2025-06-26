// ChatbotScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sarufi from 'sarufi'; // 🌟

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const BOT_ID = 6062;

sarufi.login({ api_key: 'eee785909d281f837418de3da1dac0216e550f028e4e65b795d1ea044297725d' });

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('chat_messages').then(saved => saved && setMessages(JSON.parse(saved)));
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

    try {
      const res = await sarufi.chat({ bot_id: BOT_ID, message: input });
      const botText = Array.isArray(res.message) ? res.message.join(' ') : res.message;
      setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Hitilafu. Jaribu tena.' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        inverted
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'user' ? styles.user : styles.bot]}>
            <Text style={[styles.text, item.sender === 'user' ? styles.userText : styles.botText]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
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
  list: { justifyContent: 'flex-end', padding: 16 },
  bubble: { marginVertical: 4, padding: 12, borderRadius: 16, maxWidth: '80%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#19551B' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#fff', borderColor: '#19551B', borderWidth: 1 },
  text: { fontSize: 16 },
  userText: { color: '#fff' },
  botText: { color: '#19551B' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 20, backgroundColor: '#f1f7e9',paddingBottom: Platform.OS === 'android' ? 60 : 32, },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 12, fontSize: 16, maxHeight: 140 },
  sendBtn: { backgroundColor: '#19551B', borderRadius: 20, padding: 12, marginLeft: 8 },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
});
