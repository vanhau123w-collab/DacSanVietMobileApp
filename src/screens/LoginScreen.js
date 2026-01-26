import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { login } from '../api/authService';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            const response = await login(username, password);
            // Assuming response contains { token: '...', user: ... } or similar based on Kotlin code
            // Kotlin code: if (response.body()?.isSuccess == true) saveJwtToken(response.body()?.token)
            if (response.success || response.token) { // Adjust based on actual API response structure
                await AsyncStorage.setItem('jwt_token', response.token);
                navigation.replace('Home');
            } else {
                Alert.alert('Login Failed', response.message || 'Invalid credentials');
            }
        } catch (error) {
            Alert.alert('Login Failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        padding: theme.spacing.large,
    },
    formContainer: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.xlarge,
        borderRadius: theme.borderRadius,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: theme.fontSize.xlarge,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: theme.fontSize.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xlarge,
        textAlign: 'center',
    },
    input: {
        backgroundColor: theme.colors.inputBackground,
        color: theme.colors.text,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius,
        marginBottom: theme.spacing.medium,
        fontSize: theme.fontSize.medium,
    },
    forgotPassword: {
        color: theme.colors.primary,
        textAlign: 'right',
        marginBottom: theme.spacing.large,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: theme.fontSize.medium,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.large,
    },
    footerText: {
        color: theme.colors.textSecondary,
    },
    link: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
