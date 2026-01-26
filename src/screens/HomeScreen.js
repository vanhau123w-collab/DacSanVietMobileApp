import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('jwt_token');
                if (!storedToken) {
                    navigation.replace('Login');
                } else {
                    setToken(storedToken);
                }
            } catch (e) {
                navigation.replace('Login');
            } finally {
                setLoading(false);
            }
        };
        checkToken();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('jwt_token');
        navigation.replace('Login');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Home!</Text>
                <Text style={styles.text}>You are successfully logged in.</Text>

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: theme.spacing.xlarge,
        alignItems: 'center',
    },
    title: {
        fontSize: theme.fontSize.xlarge,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.medium,
    },
    text: {
        fontSize: theme.fontSize.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xlarge,
    },
    button: {
        backgroundColor: theme.colors.error, // Red for logout
        paddingHorizontal: theme.spacing.xlarge,
        paddingVertical: theme.spacing.medium,
        borderRadius: theme.borderRadius,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
