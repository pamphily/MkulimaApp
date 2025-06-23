import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SarufiChatbox from 'react-sarufi-chatbox';

const ChatBotScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SarufiChatbox botId={6062} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f7e9', // same as Forum screen background
    paddingTop: 10,
  },
});

export default ChatBotScreen;
