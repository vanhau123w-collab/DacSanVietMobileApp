import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { resetPasswordWithOtp } from '../api/authService';

const ResetPasswordScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!otp || !newPassword) {
            Alert.alert('Error', 'Please enter OTP and new password.');
            return;
        }

        setLoading(true);
        try {
            const response = await resetPasswordWithOtp(email, otp, newPassword);
            if (response.success || response.isSuccess) {
                Alert.alert('Success', 'Password reset successfully. Please login.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', response.message || 'Failed to reset password.');
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
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter OTP and your new password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="OTP Code"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Reset Password</Text>
                    )}
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
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: theme.fontSize.medium,
    },
});

export default ResetPasswordScreen;
