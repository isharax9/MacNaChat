import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const UserProfileScreen = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user profile data from the backend
        const fetchUserProfile = async () => {
            try {
                const userId = '1';  // replace with actual userId, e.g., from context or async storage
                const response = await fetch(`https://hyena-brave-python.ngrok-free.app/MacNaChat/UserProfile?userId=${userId}`);
                const data = await response.json();

                if (data.success) {
                    setUserData(data.user);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to fetch user data');
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
                    <Text style={styles.label}>First Name:</Text>
                    <Text style={styles.value}>{userData.first_name}</Text>
                    
                    <Text style={styles.label}>last Name:</Text>
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
