import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, HelperText } from 'react-native-paper';
import tw from 'twrnc';
import { sendPasswordResetOtp } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';
import { validateEmail } from '../utils/validation';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSendOtp = async () => {
        if (!email) {
            setError('Vui lòng nhập email');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email không hợp lệ');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const response = await sendPasswordResetOtp(email);
            if (response.success || response.isSuccess) {
                alert('OTP đã được gửi đến email của bạn.');
                navigation.navigate('ResetPassword', { email });
            } else {
                alert(response.message || 'Gửi OTP thất bại.');
            }
        } catch (error) {
            alert(error.message || 'Có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-grow px-6 pt-10`}>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-8`}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>

                    <View style={tw`mb-8`}>
                        <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>Quên mật khẩu</Text>
                        <Text style={tw`text-gray-500 text-base`}>
                            Nhập địa chỉ email liên kết với tài khoản của bạn để nhận mã khôi phục mật khẩu.
                        </Text>
                    </View>

                    <View style={tw`mb-6`}>
                        <TextInput
                            label="Địa chỉ Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (error) setError(null);
                            }}
                            mode="outlined"
                            style={tw`bg-white`}
                            activeOutlineColor="#2563EB"
                            left={<TextInput.Icon icon="email-outline" color="#6B7280" />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={!!error}
                        />
                        {error && <HelperText type="error" visible={true}>{error}</HelperText>}
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSendOtp}
                        loading={loading}
                        disabled={loading}
                        buttonColor="#2563EB"
                        contentStyle={tw`h-12`}
                        labelStyle={tw`text-lg font-bold`}
                        style={tw`rounded-xl shadow-lg mb-4`}
                    >
                        {loading ? 'Đang gửi...' : 'GỬI MÃ OTP'}
                    </Button>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
