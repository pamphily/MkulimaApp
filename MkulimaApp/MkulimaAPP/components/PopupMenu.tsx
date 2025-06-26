import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthProvider';

const { width, height } = Dimensions.get('window');

type Props = {
  onClose: () => void;
};

const PopupMenu: React.FC<Props> = ({ onClose }) => {
  const navigation = useNavigation();
  const { clearAuthData } = useAuth();
  const translateX = useSharedValue(width);

  useEffect(() => {
    translateX.value = withTiming(width / 2, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    });

    const timeout = setTimeout(() => {
      translateX.value = withTiming(width, { duration: 300 }, () => {
        runOnJS(onClose)();
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.translationX !== 0) {
        translateX.value = width / 2 + event.translationX;
      }
    },
    onEnd: (event) => {
      if (event.translationX > 80) {
        translateX.value = withTiming(width, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateX.value = withTiming(width / 2, { duration: 200 });
      }
    },
  });

  const rSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - width / 2 }],
  }));

  const handleNavigate = (screenName: string) => {
    onClose();
    navigation.navigate(screenName as never);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      clearAuthData();
      onClose();

    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </BlurView>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.menuContainer, rSlideStyle]}>
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Chatbot')}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="#19551B" />
              <Text style={styles.menuText}>Chatbot</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('ChatList')}>
              <Ionicons name="chatbox-outline" size={22} color="#19551B" />
              <Text style={styles.menuText}>Chat System</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Profile')}>
              <Ionicons name="person-outline" size={24} color="#19551B" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#19551B" />
              <Text style={[styles.menuText, { color: '#19551B' }]}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { marginTop: 40 }]}
              onPress={onClose}
            >
              <Ionicons name="close-circle-outline" size={26} color="#aaa" />
              <Text style={[styles.menuText, { color: '#aaa' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 35,
    right: 0,
    width: width / 2,
    height: height - 70,
    backgroundColor: '#F7FBF1BF',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  menuContent: {
    padding: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#19551B',
  },
});

export default PopupMenu;
