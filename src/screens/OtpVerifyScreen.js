import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { verifyOtp, resendOtp } from '../services/authService';
import { useDispatch } from 'react-redux';
import { verifyPhoneChange as verifyPhoneChangeAction, verifyPasswordChange } from '../store/slices/authSlice';

const OtpVerifyScreen = ({ route, navigation }) => {
    // Debug Log to confirm new code is loaded
    useEffect(() => {
        console.log('OtpVerifyScreen Loaded');
        console.log('Route Params:', route.params);
    }, []);

    const { email, username, password, fullName, role, type, phoneNumber, newPassword, otpToken, currentPassword } = route.params;
    const dispatch = useDispatch();
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
            if (type === 'CHANGE_PASSWORD_OTP') {
                console.log('CHANGE_PASSWORD_OTP - currentPassword:', currentPassword, 'newPassword:', newPassword, 'otp:', otp, 'otpToken:', otpToken);
                dispatch(verifyPasswordChange({ currentPassword, newPassword, otpCode: otp, otpToken }))
                    .unwrap()
                    .then(() => {
                        Alert.alert('Success', 'Password changed successfully!');
                        navigation.navigate('Profile');
                    })
                    .catch((err) => {
                        Alert.alert('Verification Failed', err || 'Invalid OTP');
                    })
                    .finally(() => setLoading(false));
                return;
            }

            if (type === 'UPDATE_PHONE') {
                console.log('UPDATE_PHONE - phoneNumber:', phoneNumber, 'otp:', otp, 'otpToken:', otpToken);
                dispatch(verifyPhoneChangeAction({ newPhone: phoneNumber, otpCode: otp, otpToken: otpToken }))
                    .unwrap()
                    .then(() => {
                        Alert.alert('Success', 'Phone number updated successfully!');
                        navigation.goBack();
                    })
                    .catch((err) => {
                        Alert.alert('Verification Failed', err || 'Invalid OTP');
                    })
                    .finally(() => setLoading(false));
                return;
            }

            // Default: Registration Verification
            console.log('Verifying Registration OTP with payload:', { email, otp, username, password, fullName, role });
            const response = await verifyOtp(email, otp, username, password, fullName, role);
            if (response.success || response.isSuccess) {
                if (response.token) {
                    await AsyncStorage.setItem('jwt_token', response.token);
                }
                Alert.alert('Success', 'Verification successful!');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                Alert.alert('Verification Failed', response.message || 'Invalid OTP');
            }
        } catch (error) {
            console.log('Verify OTP Error Details:', JSON.stringify(error, null, 2));
            Alert.alert('Verification Failed', error.message || JSON.stringify(error) || 'Something went wrong');
        } finally {
            if (type !== 'UPDATE_PHONE' && type !== 'CHANGE_PASSWORD_OTP') setLoading(false);
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
                <Text style={styles.subtitle}>
                    {type === 'UPDATE_PHONE'
                        ? `Enter the code sent to ${email} to verify phone change`
                        : type === 'CHANGE_PASSWORD_OTP'
                            ? `Enter the code sent to ${email} to change password`
                            : `Enter the code sent to ${email}`}
                </Text>

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
