import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { verifyOtp, resendOtp } from '../services/authService';

const OtpVerifyScreen = ({ route, navigation }) => {
    const { email, username, password, fullName, role } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) { // Assuming 6 digit OTP
            Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOtp(email, otp, username, password, fullName, role);
            if (response.success || response.isSuccess) {
                if (response.token) {
                    await AsyncStorage.setItem('jwt_token', response.token);
                }
                Alert.alert('Success', 'Verification successful!');
                // Ideally navigate to Home or Login
                // Kotlin code went to MainActivty (Home)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                Alert.alert('Verification Failed', response.message || 'Invalid OTP');
            }
        } catch (error) {
            Alert.alert('Verification Failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            const response = await resendOtp(email);
            if (response.success || response.isSuccess) {
                Alert.alert('Success', 'OTP Resent. Check your email.');
            } else {
                Alert.alert('Error', response.message || 'Failed to resend OTP');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>Enter the code sent to {email}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                />

                <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Verify</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                    <Text style={styles.resendText}>
                        {resendLoading ? 'Resending...' : 'Resend OTP'}
                    </Text>
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
        fontSize: theme.fontSize.large,
        textAlign: 'center',
        letterSpacing: 4,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
        marginTop: theme.spacing.medium,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: theme.fontSize.medium,
    },
    resendText: {
        color: theme.colors.secondary,
        textAlign: 'center',
        marginTop: theme.spacing.large,
        textDecorationLine: 'underline',
    },
});

export default OtpVerifyScreen;
