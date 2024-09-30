import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomePage = () => {
    // Sample data for chats with online status
    const chatData = [
        { id: '1', name: 'Alice', lastMessage: 'Hey, how are you?', time: '12:45 PM', isOnline: true },
        { id: '2', name: 'Bob', lastMessage: 'Are you coming?', time: '11:30 AM', isOnline: false },
        { id: '3', name: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday', isOnline: true },
        { id: '4', name: 'Alice', lastMessage: 'Hey, how are you?', time: '12:45 PM', isOnline: false },
        { id: '5', name: 'Bob', lastMessage: 'Are you coming?', time: '11:30 AM', isOnline: true },
        { id: '6', name: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday', isOnline: false },
        { id: '7', name: 'Alice', lastMessage: 'Hey, how are you?', time: '12:45 PM', isOnline: true },
        { id: '8', name: 'Bob', lastMessage: 'Are you coming?', time: '11:30 AM', isOnline: false },
        { id: '9', name: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday', isOnline: true },
    ];

    // Render function for each chat item
    const renderChatItem = ({ item }) => (
        <View style={styles.chatItem}>
            {/* Dynamic border color for online/offline status */}
            <View style={[styles.chatAvatar, { borderColor: item.isOnline ? 'yellow' : 'black' }]} />
            <View style={styles.chatContent}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMessage}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.chatTime}>{item.time}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Section with logged-in user details */}
            <View style={styles.userInfo}>
                <View style={styles.userAvatar} />
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>Name</Text>
                    <Text style={styles.userMobile}>Mobile</Text>
                </View>
                <Text style={styles.userSince}>Since .....</Text>
            </View>

            {/* Chat List Section */}
            <FlatList
                data={chatData}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatList}
            />
        </SafeAreaView>
    );
};

registerRootComponent(HomePage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        marginHorizontal: 7,
        borderRadius: 8,
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'blue', // Placeholder color for avatar
    },
    userDetails: {
        marginLeft: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userMobile: {
        fontSize: 14,
        color: '#555',
    },
    userSince: {
        marginLeft: 'auto',
        fontSize: 12,
        color: '#888',
    },
    chatList: {
        paddingHorizontal: 15,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    chatAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        backgroundColor: '#ccc', // Placeholder for avatar image
    },
    chatContent: {
        flex: 1,
        marginLeft: 10,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatMessage: {
        fontSize: 14,
        color: '#555',
    },
    chatTime: {
        color: 'red', // Color for date/time
        fontSize: 12,
    },
});

export default HomePage;
