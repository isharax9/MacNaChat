// Removed unused import
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home() {

    useEffect(() => {
        async function fetchData() {

            let userJson = await AsyncStorage.getItem('user');
            let user = JSON.parse(userJson);
            let response = await fetch("https://cardinal-above-physically.ngrok-free.app/MacNaChat/LoadHomeData?id=" + user.id);

            // Handle the response here
            if (response.ok) {
                let json = await response.json();

                if (json.success) {
                    console.log(json);
                }
            }else {
                console.log("Error: " + response.status);
            }
        }

        fetchData();
    }, []);


    // Sample data for chats with online status and message seen status
    const chatData = [
        { id: '1', name: 'Alice', lastMessage: 'Hey, how are you?', time: '12:45 PM', isOnline: true, isSeen: true },
        { id: '2', name: 'Bob', lastMessage: 'Are you coming?', time: '11:30 AM', isOnline: false, isSeen: false },
        { id: '3', name: 'Charlie', lastMessage: 'Let’s meet up!kkkkkkkffgghhllii', time: 'Yesterday', isOnline: true, isSeen: true },
        { id: '4', name: 'Alice', lastMessage: 'Hey, how are you?', time: '12:45 PM', isOnline: false, isSeen: false },
        { id: '5', name: 'Bob', lastMessage: 'Are you coming?', time: '11:30 AM', isOnline: true, isSeen: true },
        { id: '6', name: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday', isOnline: false, isSeen: false },
        { id: '7', name: 'Alice', lastMessage: 'Hey, how are you?', time: '12:45 PM', isOnline: true, isSeen: true },
        { id: '8', name: 'Bob', lastMessage: 'Are you coming?', time: '11:30 AM', isOnline: false, isSeen: false },
        { id: '9', name: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday', isOnline: true, isSeen: true },
    ];

    // Function to truncate long messages
    const truncateMessage = (message, maxLength) => {
        if (message.length > maxLength) {
            return message.substring(0, maxLength) + '***';
        }
        return message;
    };

    // Render function for each chat item
    const renderChatItem = ({ item }) => (

        <View style={styles.chatItem}>
            <View style={styles.avatarContainer}>
                {/* Placeholder avatar */}
                <View style={styles.chatAvatar} />

                {/* Online/Offline status text */}
                <Text style={[styles.statusText, { backgroundColor: item.isOnline ? 'green' : 'gray' }]}>
                    {item.isOnline ? 'online' : 'offline'}
                </Text>
            </View>
            <View style={styles.chatContent}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMessage} numberOfLines={1} ellipsizeMode="tail">
                    {truncateMessage(item.lastMessage, 30)}
                </Text>
            </View>

            <Text style={styles.chatTime}>{item.time}</Text>

            {/* Render icon based on whether the message is seen or not */}
            {item.isSeen ? (
                <FontAwesome6 name="check-double" size={16} color="blue" /> // Seen: double check in blue
            ) : (
                <FontAwesome6 name="check" size={16} color="#888" /> // Not Seen: single check in gray
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={true} backgroundColor="black" />
            {/* Top Section with logged-in user details */}
            {/* <View style={styles.userInfo}>
                <View style={styles.userAvatar} />
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>Name</Text>
                    <Text style={styles.userMobile}>Mobile</Text>
                </View>
                <Text style={styles.userSince}>Since .....</Text>
            </View> */}

            {/* Chat List Section */}
            <FlatList
                data={chatData}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatList} />
        </SafeAreaView>
    );
}



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
        marginTop: 0,
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
        columnGap: 10,
    },
    avatarContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    chatAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc', // Placeholder for avatar image
    },
    statusText: {
        position: 'absolute',
        bottom: -5,
        left: 0,
        color: 'white',
        fontSize: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
        overflow: 'hidden',
        
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
        overflow: 'hidden',
    },
    chatTime: {
        color: 'red', // Color for date/time
        fontSize: 12,
    },
});

export default Home;
