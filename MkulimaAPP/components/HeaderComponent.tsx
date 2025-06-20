import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import PopupMenu from './PopupMenu'; // Ensure the path is correct

type HeaderProps = {
  title: string;
  showBack?: boolean;
};

const HeaderComponent: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0C0C0D" />
            </TouchableOpacity>
          ) : (
            <Image source={require('../assets/logo/splash-icon.png')} style={styles.logo} />
          )}
        </View>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Ionicons name={menuVisible ? "close" : "ellipsis-vertical"} size={24} color="#0C0C0D" />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <PopupMenu onClose={() => setMenuVisible(false)} />
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F0F6EC',
    height: 61,
  },
  headerLeft: { width: 60, alignItems: 'flex-start' },
  headerRight: { width: 60, alignItems: 'flex-end' },
  logo: { width: 51, height: 51, borderRadius: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C0C0D',
    textAlign: 'center',
    flex: 1,
  },
  backButton: { padding: 4 },
});

export default HeaderComponent;
