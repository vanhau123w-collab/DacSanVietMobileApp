import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { sendPasswordResetOtp } from '../api/authService';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email.');
            return;
        }

        setLoading(true);
        try {
            const response = await sendPasswordResetOtp(email);
            if (response.success || response.isSuccess) {
                Alert.alert('Success', 'OTP sent to your email.');
                navigation.navigate('ResetPassword', { email });
            } else {
                Alert.alert('Error', response.message || 'Failed to send OTP.');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>Enter your email to receive a reset code</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Send OTP</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backLink}>Back to Login</Text>
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
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
        marginBottom: theme.spacing.medium,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: theme.fontSize.medium,
    },
    backLink: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.small,
    },
});

export default ForgotPasswordScreen;
