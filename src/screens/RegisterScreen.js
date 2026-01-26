import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { register } from '../api/authService';

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !username || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await register(email, username, password, fullName);
            if (response.success || response.isSuccess) { // Adjust based on API
                Alert.alert('Success', 'Registration initiated. Please verify OTP sent to your email.');
                navigation.navigate('OtpVerify', {
                    email,
                    username,
                    password,
                    fullName
                });
            } else {
                Alert.alert('Registration Failed', response.message || 'Failed to register');
            }
        } catch (error) {
            Alert.alert('Registration Failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join us today!</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

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

                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
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
    button: {
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
        marginTop: theme.spacing.medium,
    },
    buttonText: {
        color: '#000', // Text on secondary color (teal) should be dark
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
        color: theme.colors.secondary,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
