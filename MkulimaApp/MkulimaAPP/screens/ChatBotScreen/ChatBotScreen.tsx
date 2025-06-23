import React, { useEffect, useRef, useState } from 'react';
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
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    saveMessages();
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('chat_messages', JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save messages:', err);
    }
  };

  const loadMessages = async () => {
    try {
      const saved = await AsyncStorage.getItem('chat_messages');
      if (saved) setMessages(JSON.parse(saved));
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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', // Replace with your actual API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Jibu kila kitu kwa Kiswahili kama msaidizi wa kilimo.' },
            { role: 'user', content: input },
          ],
        }),
      });

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || 'Samahani, sikuelewa.';
      const botMessage: ChatMessage = { sender: 'bot', text: reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Samahani, kuna hitilafu kwenye mtandao.' },
      ]);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.botText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.wrapper}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 70}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
          />

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Andika ujumbe wako..."
              placeholderTextColor="#666"
              multiline
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f7e9',
  },
  wrapper: {
    flex: 1,
  },
  messagesContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#19551B',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#19551B',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#19551B',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f1f7e9',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 55,
    maxHeight: 140,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#19551B',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
