import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user profile data from AsyncStorage
        const fetchUserProfile = async () => {
            try {
                // Retrieve user data from AsyncStorage
                const userJson = await AsyncStorage.getItem("user");
                if (userJson) {
                    const userData = JSON.parse(userJson);
                    setUserData(userData);
                } else {
                    setError('No user data found in AsyncStorage');
                }
            } catch (err) {
                setError('Failed to fetch user data from AsyncStorage');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {userData ? (
                <View>
                    <Text style={styles.title}>About Me</Text>
                    <Text style={styles.label}>First Name:</Text>
                    <Text style={styles.value}>{userData.first_name}</Text>

                    <Text style={styles.label}>Last Name:</Text>
                    <Text style={styles.value}>{userData.last_name}</Text>

                    <Text style={styles.label}>Password:</Text>
                    <Text style={styles.value}>{userData.password}</Text>

                    <Text style={styles.label}>Mobile:</Text>
                    <Text style={styles.value}>{userData.mobile}</Text>

                    <Text style={styles.label}>Registered On:</Text>
                    <Text style={styles.value}>{userData.registered_date_time}</Text>

                    {/* Add more fields as needed */}
                </View>
            ) : (
                <Text style={styles.errorText}>No user data found</Text>
            )}
        </View>
    );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7f8c8d',
        marginTop: 10,
    },
    value: {
        fontSize: 20,
        fontWeight: '400',
        color: '#34495e',
        marginBottom: 10,
    },
});
