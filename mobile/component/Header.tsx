import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Entypo } from '@expo/vector-icons';


export const Header = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [notifVisible, setNotifVisible] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    
    const toggleMenu = () => setMenuVisible(!menuVisible);
    const toggleNotif = () => setNotifVisible(!notifVisible);

  const openMenu = () => {
    // TODO: implement modal or dropdown
    console.log('Open menu');
  };

  const openNotifications = () => {
    // TODO: navigate or open notification drawer
    console.log('Notifications');
  };

  const handleNavigate = (screen: string) => {
    setMenuVisible(false);
    navigation.navigate(screen as never); // adjust typing if needed
  };

  const handleLogout = () => {
    setMenuVisible(false);
    console.log('Logging out...');
    // TODO: implement logout logic
  };

  const notifications = [
    { id: '1', message: 'New comment on your post' },
    { id: '2', message: 'You have a new follower' },
    { id: '3', message: 'Your post was upvoted' },
  ];

  return (
    <>
    <View style={styles.container}>

<View style={styles.iconsContainer}>
  <TouchableOpacity  onPress={() => setNotifVisible(true)}  style={styles.iconButton}>
    <Ionicons name="notifications-outline" size={24} color="#333" />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.iconButton}>
    <Entypo name="dots-three-vertical" size={20} color="#333" />
  </TouchableOpacity>
</View>
</View>
    <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => handleNavigate('Profile')} style={styles.menuItem}>
              <Text style={styles.menuText}>👤 Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Settings')} style={styles.menuItem}>
              <Text style={styles.menuText}>⚙️ Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Text style={[styles.menuText, { color: '#e53935' }]}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
         transparent 
         visible={notifVisible} 
         animationType="slide"
      >
        <Pressable style={styles.modalOverlay} onPress={() => setNotifVisible(false)}>
          <View style={styles.notificationDropdown}>
            <Text style={styles.notificationHeader}>Notifications</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <Ionicons name="notifications" size={16} color="#555" style={{ marginRight: 8 }} />
                  <Text style={styles.notificationText}>{item.message}</Text>
                </View>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
    
  )
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },

  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: "#1BB582"
  },
  iconButton: {
    marginLeft: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 16,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    width: 160,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  notificationDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 250,
    padding: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  notificationHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2a2a2a',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#444',
    flexShrink: 1,
  },
})